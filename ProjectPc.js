// * PC that shows all projects with redirecting to Github

class ProjectPc extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/objects/projectpc.png",
            animations: {
                "turned-on" : [ [0,0] ],
                "turned-off": [ [1,0] ],
            },
            currentAnimation: "turned-off"
        });

        // instantiate projects
        this.projects = config.projects;
        this.pcType = config.pcType;
        // can be placed here or extracted out to the main OverworldMap
        this.talking = [
            {
                events: [
                    { type: "changePCState", sprite: this.sprite },
                    { type: "textMessage", text: "Booting up PC..." },
                    { type: "projectMenu", projects: this.projects, pcType: this.pcType },
                    { type: "changePCState", sprite: this.sprite },
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