class Sprite {
    constructor(config) {
        
        //Creating image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Shadow rendering
        this.shadow = new Image();
        this.useShadow = true; //config.useShadow || false
        if (this.useShadow) { //only if this.useShadow == true will the sprite be loaded into the browser
            this.shadow.src = "./images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        //Game object reference
        this.gameObject = config.gameObject;

        //Animations & Initial State, can add more animations + frames other than idle and walk
        this.animations = config.animations || {
            "idle-down" : [ [0,0] ],
            "idle-right" : [ [0,1] ],
            "idle-up" : [ [0,2] ],
            "idle-left" : [ [0,3] ],
            "walk-down" : [ [1,0], [2,0] , [3,0], [0,0] ],
            "walk-right" : [ [1,1], [2,1] , [3,1], [0,1] ],
            "walk-up" : [ [1,2], [2,2] , [3,2], [0,2] ],
            "walk-left" : [ [1,3], [2,3] , [3,3], [0,3] ],
        }
        this.currentAnimation = config.currentAnimation || "idle-down"; 
        this.currentAnimationFrame = 0; // which array or position within the animation array

        this.animationFrameLimit = config.animationFrameLimit || 8; // how many frames would the character stay in that current animationframe before changing
        this.animationFrameProgress = this.animationFrameLimit;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame] // returns which frame within the animation that is being used
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) { //resets the animation back to the 1st frame if the input key is diff from the prev input, otherwise, the animation will just continue
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        //Decrease frame progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        //Reset counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;
        
        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }

    }

    draw(ctx, camera) {
        const x = this.gameObject.x - 8 + utilities.withGrid(10.5) - camera.x; //x coord on canvas, -8 is to compensate for 32x32 spritesheet //10.5 is basically half the size of the screen width that we are using now
        const y = this.gameObject.y - 18 + utilities.withGrid(6) - camera.y; //y coord on canvas, -18 is to compensate for 32x32 spritesheet // 6 is basically half the size of the screen height that we are using now
        
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)
        //Drawing will only be done once this.isLoaded is True, when the image is done being loaded into the browser
        // drawImage takes in context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);

        const [frameX, frameY] = this.frame;
        this.isLoaded && ctx.drawImage(this.image,
            frameX*32,frameY*32, //left cut of starting frame, top cut of starting frame
            32,32, //width of cut from sprite sheet, height of cut from sprite sheet
            x,y,
            32,32 //width of sprite to draw on canvas, height of sprite to draw on canvas
        )
        this.updateAnimationProgress();
    }

}