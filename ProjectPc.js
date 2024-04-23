// PC that shows all projects with redirecting to Github
// TODO: Add another pc class that would show individual projects that uses ProjectKeyboardMenu.js

class ProjectPc extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: "/images/characters/projectpc.png",
            animations: {
                "turned-on" : [ [0,0] ],
                "turned-off": [ [2,0] ],
            },
            currentAnimation: "turned-on"
        });
        // this.storyFlag = config.storyFlag;
        // instantiate projects
        this.projects = config.projects;
        // can be placed here or extracted out to the main OverworldMap
        this.talking = [
            {
                events: [
                    { type: "textMessage", text: "Accessing projects from the PC..." },
                    { type: "projectMenu", projects: this.projects },
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