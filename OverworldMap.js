class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.lowerImage = new Image(); //actual map
        this.lowerImage.src = config.lowerSrc;
        
        this.upperImage = new Image(); // all the upper portions of the map
        this.upperImage.src = config.upperSrc;
    }

    drawLowerImage(ctx) {
        ctx.drawImage(this.lowerImage, 0, 0);
    }

    drawUpperImage(ctx) {
        ctx.drawImage(this.upperImage, 0, 0);
    }
}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: {
            main: new GameObject({
                x : 5,
                y : 6,
            }),
            npc1: new GameObject({
                x : 7,
                y : 9,
                src : "./images/characters/people/npc1.png",
            })
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