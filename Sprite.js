class Sprite {
    constructor(config) {
        this.animations = config.animations || {
            idleDown : [
                [0,0]
            ]
        }
        this.currentAnimation = config.currentAnimation || "idleDown"; 
        this.currentAnimationFrame = 0;
        
    }
}