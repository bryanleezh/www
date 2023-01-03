class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this, //gameObject would include this.x & this.y
            src: config.src || "./images/characters/people/player.png", //if no src is given, default will just be main character
        });

        this.behaviourLoop = config.behaviourLoop || [];
        this.behaviourLoopIndex = 0;
    }
    mount(map){
        console.log("mounting")
        this.isMounted = true;
        map.addWall(this.x, this.y);

        //if there is a behaviour, start behaviourLoop for npc
        setTimeout(() => {
            this.doBehaviourEvent(map);
        }, 10)
    }
    update() {
    }

    async doBehaviourEvent(map) {
        //Edge cases: if there is no behaviour provided or there is cutscenes playing, this will pause the character's behaviour temporarily
        if (map.cutScene || this.behaviourLoop.length === 0) {
            return;
        }

        //Set up all events with relevant info
        let eventConfig = this.behaviourLoop[this.behaviourLoopIndex]; //start with the first event in the behaviourLoop
        eventConfig.who = this.id; //identifies who will be the character using this certain behaviour by linking it to its id
        
        //Create new event instance from next event config
        const eventHandler = new OverworldEvent({map, event : eventConfig });
        await eventHandler.init(); //this event must happen 1st, otherwise the rest of the code after this will not run

        //Setting next event
        this.behaviourLoopIndex += 1;
        if (this.behaviourLoopIndex === this.behaviourLoop.length) {
            this.behaviourLoopIndex = 0;
        }

        //Do behaviour again
        this.doBehaviourEvent(map);
    }
}