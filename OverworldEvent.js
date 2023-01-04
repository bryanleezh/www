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

        //Call for the map transition to happen, where we add the div before changing the map
        const mapTransition = new MapTransition();
        mapTransition.init(document.querySelector(".game-container"), () => { //parameters are container, callback
            //Change the map
            this.map.overworld.startMap(window.OverworldMaps[this.event.map]) //In the event parameter the key is just map so this.event.map would work
            resolve(); //basically resets the overworld event into the new map
            // console.log("map change complete");
            //remove div where transition happened
            mapTransition.fadeOut();
        })
        
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve);
        })
    }

}