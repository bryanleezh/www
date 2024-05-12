// * Arcade pc that shows only 1 project or experience

class IndivProjectArcade extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/objects/arcade-red.png",
            animations: {
                "turned-on" : [ [1,0] ],
                "turned-off": [ [2,0] ],
            },
            currentAnimation: "turned-off"
        });
        // this.storyFlag = config.storyFlag;
        // instantiate projects
        this.project = config.project;
        // can be placed here or extracted out to the main OverworldMap
        this.talking = [
            {
                events: [
                    { type: "changePCState", sprite: this.sprite },
                    { type: "textMessage", text: "Booting up the project arcade..." },
                    { type: "indivProjectMenu", project: this.project },
                    { type: "changePCState", sprite: this.sprite },
                ]
            }
        ];
    }

    update() {
        // this.sprite.currentAnimation = "turned-off";
        // this.sprite.currentAnimation = playerState.storyFlag[this.storyFlag]
        // ? "turned-on"
        // : "turned-off"
    }
}