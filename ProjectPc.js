class ProjectPc extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new this.Sprite({
            gameObject: this,
            src: "/images/characters/projectpc.png",
            animations: {
                "turned-on" : [ [0,0] ],
                "turned-off": [ [1,0] ],
            },
            currentAnimation: "turned-off"
        });
        this.storyFlag = config.storyFlag;

        this.talking = [
            
        ];
    }

    update() {
        this.sprite.currentAnimation = playerState.storyFlag[this.storyFlag]
        ? "turned-on"
        : "turned-off"
    }
}