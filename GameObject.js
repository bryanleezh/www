class GameObject {
    constructor(config) {
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this, //gameObject would include this.x & this.y
            src: config.src || "./images/characters/people/main_character.png", //if no src is given, default will just be main character
        });
    }
    mount(map){
        console.log("mounting")
        this.isMounted = true;
        map.addWall(this.x, this.y);
    }
    update() {

    }
}