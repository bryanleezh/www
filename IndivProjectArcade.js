// Arcade pc that shows only 1 project
// TODO: Add another pc class that would show individual projects that uses ProjectKeyboardMenu.js
// ! Done with logic

class IndivProjectArcade extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            // TODO: Add new project arcade sprite
            src: "/images/characters/projectpc.png",
            animations: {
                "turned-on" : [ [0,0] ],
                "turned-off": [ [2,0] ],
            },
            currentAnimation: "turned-on"
        });
        // this.storyFlag = config.storyFlag;
        // instantiate projects
        this.project = config.project;
        // can be placed here or extracted out to the main OverworldMap
        this.talking = [
            {
                events: [
                    { type: "textMessage", text: "Booting up the PC..." },
                    { type: "indivProjectMenu", project: this.project },
                ]
            }
        ];
    }

    // TODO: Figure out how else i can turn on and off pc through state
    update() {
        // this.sprite.currentAnimation = "turned-off";
        // this.sprite.currentAnimation = playerState.storyFlag[this.storyFlag]
        // ? "turned-on"
        // : "turned-off"
    }
}