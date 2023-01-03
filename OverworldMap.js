class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

        this.lowerImage = new Image(); //actual map
        this.lowerImage.src = config.lowerSrc;
        
        this.upperImage = new Image(); // all the upper portions of the map
        this.upperImage.src = config.upperSrc;

        this.cutScene = false;

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

    async startCutscene(events){ //events would be an array
        this.cutScene = true;
        //Start loop of async events
        //Await each one
        for (let i=0; i<events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map : this,
            })
            await eventHandler.init(); //wait for all the events in the loop to finish before initialising the event
        }

        this.cutScene = false; //Once cutscene is done, the cutScene flag will be set back to false and everyone's movement will be back to normal
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
        Object.keys(this.gameObjects).forEach(key => {
            
            let object = this.gameObjects[key]
            object.id = key //id of the object will be the name given to the object such as player,npc1,npc2 etc

            //TODO: determine if this object should actually mount

            object.mount(this);
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
            }),
            npc1: new Character({
                x : utilities.withGrid(7),
                y : utilities.withGrid(9),
                src : "./images/characters/people/main_character.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 800},
                    {type : "stand", direction : "down", time : 800},
                    {type : "stand", direction : "right", time : 1200},
                    {type : "stand", direction : "down", time : 300},
                ]
            }),
            npc2: new Character({
                x : utilities.withGrid(3),
                y : utilities.withGrid(7),
                src : "./images/characters/people/npc1.png",
                behaviourLoop : [ //basic npc movement
                    {type : "walk", direction : "left"},
                    {type : "stand", direction : "up", time: 800 },
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "down"},
                ]
            }),
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