class Map{
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    //gameloop that constantly loops through all the states of everything in the game
    startGameLoop() {
        const step = () => {

            //clear all drawings in canvas so that drawn game objects will not overlap each other
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

            //Camera
            const camera = this.map.gameObjects.main; // to focus only on the main character and his coordinates

            //Update all objects before drawing anything so that eberything will be moved 1st and then everything is drawn out
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction, // returns the direction that is being held down by the certain key, if nothing is held down, arrow will just be undefined
                    map: this.map,
                });
            });

            //Draw lower layer
            this.map.drawLowerImage(this.ctx, camera);

            //Draw Game Objects
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;                                   //Sorts the gameObjects according ascending y coord values so that there would not be overlaps when gameObjects are drawn on screen
            }).forEach(object => {
                object.sprite.draw(this.ctx, camera);
            });
            
            //Draw upper layer
            this.map.drawUpperImage(this.ctx, camera);

            requestAnimationFrame( () => { //mad loop that works better than setInterval, which will call this function again whenever a new frame starts
                step();
            })
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //check on map if there is anything/anyone to interact with
            this.map.checkForActionCutscene();
        })
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.map.mountObjects();

        this.bindActionInput();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
        //cutscene event that happens
        // this.map.startCutscene([
        //     { who : "main", type : "walk", direction: "down" },
        //     { who : "main", type : "walk", direction: "down" },
        //     { who : "npc1", type : "walk", direction: "up" },
        //     { who : "npc1", type : "walk", direction: "left" },
        //     { who : "main", type : "stand", direction: "right", time:200 },
        //     { type: "textMessage", text: "Hello"},

        //     // { who : "npc1", type : "walk", direction: "left" },
        //     // { who : "npc1", type : "walk", direction: "left" },
        //     // { who : "npc1", type : "stand", direction: "up", time: 800 },
        // ])
    }
}