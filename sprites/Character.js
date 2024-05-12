class Character extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isStanding = false; //flag for whether character will be standing or walking
        this.intentPosition = null; // will either be null or [x,y]

        this.isPlayer = config.isPlayer || false;

        this.directionUpdate = {
            "up" : ["y", -1],
            "down" : ["y", 1],
            "left" : ["x", -1],
            "right" : ["x", 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            //Other walk cases

            //when there are no cutscenes and keys are pressed
            if (!state.map.cutScene && this.isPlayer && state.arrow) {
                this.startBehaviour(state,{
                    type: "walk",
                    direction: state.arrow,
                });
            }
        this.updateSprite();
        }
    }

    // starts the walking animation
    startBehaviour(state, behaviour) {

        if (!this.isMounted) {
            return;
        }

        //Set character direction
        this.direction = behaviour.direction;
        if (behaviour.type === "walk") {
            //if player collides with something, the function stops and player cannot move to that next part of the grid
            if (state.map.isCollided(this.x, this.y, this.direction)){
                
                behaviour.retry && setTimeout(() => {
                    this.startBehaviour(state, behaviour);
                }, 10);

                return;
            }
            //character will start moving if there is nothing it will collide with 
            this.movingProgressRemaining = 16;

            //Adds next predicted position 
            const intentPosition = utilities.nextPosition(this.x,this.y,this.direction);
            this.intentPosition = [
                intentPosition.x,
                intentPosition.y,
            ]

            this.updateSprite(state); // allows the animation of the sprite when walking
        }

        if (behaviour.type === "stand") {
            this.isStanding = true;
            setTimeout(() => {
                utilities.emitEvent("PersonStandComplete", {
                    whoId : this.id,
                })
                this.isStanding = false;
            }, behaviour.time)
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction]; //property will be either x or y and change would be how much character moves based on directionUpdate dictionary
        this[property] += change;
        this.movingProgressRemaining -= 1;
        
        if (this.movingProgressRemaining === 0) {
            //walking done
            //creating custom events on the browser itself, in this case for npc walking animation
            this.intentPosition = null;
            utilities.emitEvent("PersonWalkingComplete", {
                whoId : this.id,
            })
        }
    }

    updateSprite() {
        //if character starts walking the function will end after this if statement
        if (this.movingProgressRemaining > 0 ) {
            this.sprite.setAnimation("walk-" + this.direction)
            return;
        }
        //otherwise character will be idle
        this.sprite.setAnimation("idle-"+this.direction);
    }
}