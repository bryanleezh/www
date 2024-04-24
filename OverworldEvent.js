class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) { //resolve lets the function know that the event is done and the rest of the code after the async await will run
        const who = this.map.gameObjects[this.event.who]; //finds the particular character that is having the startBehaviour()
        who.startBehaviour({
            map : this.map, //state parameter
        }, { //behaviour parameter
            type: "stand",
            direction : this.event.direction,
            time : this.event.time,
        })
        //Handler to end when correct character is done walking, then resolve the event
        const completeHandler =  e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonStandComplete", completeHandler);
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who]; //finds the particular character that is having the startBehaviour()
        who.startBehaviour({
            map : this.map, //state parameter
        }, { //behaviour parameter
            type : "walk",
            direction : this.event.direction,
            retry : true, //For cases when character gets blocked by an object
        })

        //Handler to end when correct character is done walking, then resolve the event
        const completeHandler =  e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("PersonWalkingComplete", completeHandler);

    }

    textMessage(resolve){

        if (this.event.faceMain) {
            const obj = this.map.gameObjects[this.event.faceMain];
            obj.direction = utilities.oppositeDirection(this.map.gameObjects["main"].direction)//character will face opp direction of where main character is facing
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {
        //Deactivate all objects
        Object.values(this.map.gameObjects).forEach(obj => {
            obj.isMounted = false;
        })

        //Call for the map transition to happen, where we add the div before changing the map
        const mapTransition = new MapTransition();
        mapTransition.init(document.querySelector(".game-container"), () => { //parameters are container, callback
            //Change the map
            this.map.overworld.startMap(window.OverworldMaps[this.event.map], {  //In the event parameter the key is just map so this.event.map would work
                x: this.event.x,
                y: this.event.y,
                direction: this.event.direction
            }); 
            resolve(); //basically resets the overworld event into the new map
            // console.log("map change complete");
            //remove div where transition happened
            mapTransition.fadeOut();
        })
        
    }

    pause(resolve) {
        this.map.isPause = true;
        const menu = new PauseMenu( {
            progress: this.map.overworld.progress,
            onComplete: () => {
                resolve(); //resolve the event
                this.map.isPause = false; //unpause the map
                this.map.overworld.startGameLoop(); //unfreeze the screen by updating evrtyhing again
            }
        });
        menu.init(document.querySelector(".game-container")); //initialises the pause menu and brings it up onto the screen
    }

    //custom event for adding a storyflag and putting it as true in the playerstate storyFlags list
    addStoryFlag(resolve) {
        window.playerState.storyFlags[this.event.flag] = true;
        resolve();
    }

    // custom event for opening up projects menu on pc
    projectMenu(resolve) {
        this.map.isPause = true;
        const menu = new ProjectMenu({
            projects: this.event.projects,
            onComplete: () => {
                resolve();
                this.map.isPause = false; //unpause the map
                this.map.overworld.startGameLoop(); //unfreeze the screen by updating evrtyhing again
            }
        });
        menu.init(document.querySelector(`.game-container`));
    }

    // custom event for opening up individual project on arcade pc
    indivProjectMenu(resolve) {
        this.map.isPause = true;
        const menu = new IndivProjectMenu({
            project: this.event.project,
            onComplete: () => {
                resolve();
                this.map.isPause = false; //unpause the map
                this.map.overworld.startGameLoop(); //unfreeze the screen by updating evrtyhing again
            }
        });
        menu.init(document.querySelector(`.game-container`));
    }

    // custom event to change state of pc
    changePCState(resolve) {
        if (this.event.sprite.currentAnimation == "turned-on") this.event.sprite.currentAnimation = "turned-off";
        else this.event.sprite.currentAnimation = "turned-on";
        resolve();
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve);
        })
    }

}