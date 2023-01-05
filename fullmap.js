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

            //if the player pauses causing the flag isPause to become true, gameloop will stop so that everything will not move
            if (!this.map.isPause) {
                requestAnimationFrame( () => { //mad loop that works better than setInterval, which will call this function again whenever a new frame starts
                    step();
                });
            };
            
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //check on map if there is anything/anyone to interact with
            this.map.checkForActionCutscene();
        })
        //when escape key is pressed, if there is no cutscene currently, start a new cutscene so that everything around stops moving and the pause menu will come up
        new KeyPressListener("Escape", () => {
            if (!this.map.cutScene) {
                this.map.startCutscene([
                    {type : "pause"}
                ])
            }
        })
    }

    //uses the custom event of PersonWalkingComplete to check at which coords is the main character at, then checks if there is any cutscenes at that particular coordinate
    bindMainPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => { 
            if (e.detail.whoId === "main") {
                // console.log("new main character position check")
                //main character position changed
                this.map.checkForFootstepCutscene();
            }
        })
    }

    //Initialises starting map when the whole game boots up, which can easily be changed now with the custom event changeMap in OverworldEvent.js and the map can change easily
    //mainInitialState is where the player will spawn when entering a room
    startMap(mapConfig, mainInitialState=null) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this; //sets the overworld in OverworldMap.js to the current map main character is in
        this.map.mountObjects();

        //overrides the coords at where the player will be and adds the player wall into the current map
        if (mainInitialState) {
            const {main} = this.map.gameObjects;
            this.map.removeWall(main.x,main.y);
            main.x = mainInitialState.x;
            main.y = mainInitialState.y;
            main.direction = mainInitialState.direction;
            this.map.addWall(main.x,main.y);
        }

        //for the save state config
        this.progress.mapId = mapConfig.id;
        this.progress.startingMainX = this.map.gameObjects.main.x;
        this.progress.startingMainY = this.map.gameObjects.main.y;
        this.progress.startingMainDirection = this.map.gameObjects.main.direction;
    }

    async init() {

        const container = document.querySelector(".game-container");

        //Creates new progress tracker
        this.progress = new Progress();

        //Title Screen
        this.titleScreen = new TitleScreen({ 
            progress: this.progress
        });
        const useSaveFile = await this.titleScreen.init(container);

        //Check for saved data
        let initialMainState = null;
        //try to find a save file on the local storage, if there is a savefile, load the savefile
        if (useSaveFile) {
            this.progress.load();
            //Reconfig where the player will be in the map that is spawned in
            initialMainState = {
                x: this.progress.startingMainX,
                y: this.progress.startingMainY,
                direction: this.progress.startingMainDirection,
            }
        }

        //Initialises the map
        this.startMap(window.OverworldMaps[this.progress.mapId], initialMainState);

        //Initialises controls
        this.bindActionInput(); //check if there is anywhere for main character/player to interact with the next position based on where it is standing at
        this.bindMainPositionCheck(); // checks for where the main character/player is standing

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        //Starts gameloop
        this.startGameLoop();
        //cutscene event that happens
        // this.map.startCutscene([
        //     { type : "changeMap", map : "DemoRoom" },
        //     { type: "textMessage", text: "this is the very first message"},
        // ])
    }
}