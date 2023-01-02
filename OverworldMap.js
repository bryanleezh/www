class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.walls = config.walls || {};


        this.lowerImage = new Image(); //actual map
        this.lowerImage.src = config.lowerSrc;
        
        this.upperImage = new Image(); // all the upper portions of the map
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx, camera) {
        ctx.drawImage(this.lowerImage,
                    utilities.withGrid(10.5) - camera.x,
                    utilities.withGrid(6) - camera.y);
    }

    drawUpperImage(ctx, camera) {
        ctx.drawImage(this.upperImage,
                    utilities.withGrid(10.5) - camera.x,
                    utilities.withGrid(6) - camera.y);
    }
    //if it is a wall that is found from this.walls, function will return true, otherwise it will just be false
    isCollided (currentX, currentY, direction){
        const {x,y} = utilities.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    addWall(x,y) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x,y) {
        delete this.walls[`${x},${y}`];
    }
    //removes wall at current x & y coord, locates the next position it will be after moving, then add the wall at that next coord
    moveWall(wasX,wasY,direction){
        this.removeWall(wasX,wasY);
        const {x,y} = utilities.nextPosition(wasX,wasY,direction);
        this.addWall(x,y);
    }
    //loops through all gameObjects and mounts all the gameObjects being loaded into the current screen
    mountObjects() {
        Object.values(this.gameObjects).forEach(o => {
            
            //TODO: determine if this object should actually mount

            o.mount(this);
        })
    }
}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: {
            main: new Character({
                isPlayer: true,
                x : utilities.withGrid(5),
                y : utilities.withGrid(6),
                // src : "./images/characters/people/basicman.png",
            }),
            npc1: new Character({
                x : utilities.withGrid(7),
                y : utilities.withGrid(9),
                src : "./images/characters/people/npc1.png",
            })
        },
        walls: {
            [utilities.gridCoord(7,6)] : true,
            [utilities.gridCoord(8,6)] : true,
            [utilities.gridCoord(7,7)] : true,
            [utilities.gridCoord(8,7)] : true,
        }
    },
    Kitchen: {
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
            main: new GameObject({
                x : 3,
                y : 5,
            }),
            npc1: new GameObject({
                x : 9,
                y : 8,
                src : "./images/characters/people/npc1.png",
            }),
            npc2: new GameObject({
                x : 6,
                y : 6,
                src : "./images/characters/people/npc2.png",
            })
        }
    },
}