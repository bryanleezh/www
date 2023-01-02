class Character extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;

        this.isPlayer = config.isPlayer || false;

        this.directionUpdate = {
            "up" : ["y", -1],
            "down" : ["y", 1],
            "left" : ["x", -1],
            "right" : ["x", 1],
        }
    }

    update(state) {
        this.updatePosition();
        this.updateSprite(state);

        if (this.isPlayer && this.movingProgressRemaining ===0 && state.arrow) {
            this.direction = state.arrow;
            this.movingProgressRemaining = 16;
        }
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction]; //property will be either x or y and change would be how much character moves based on directionUpdate dictionary
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

    updateSprite(state) {
        if (this.isPlayer && this.movingProgressRemaining === 0 && !state.arrow) {
            this.sprite.setAnimation("idle-" + this.direction); //sets the animation from the setAnimation method from sprite.js
            return;
        }

        if (this.movingProgressRemaining > 0 ) {
            this.sprite.setAnimation("walk-" + this.direction)
        }
    }
}