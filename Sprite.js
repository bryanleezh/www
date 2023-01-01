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

        //Animations & Initial State
        this.animations = config.animations || {
            idleDown : [
                [0,0]
            ]
        }
        this.currentAnimation = config.currentAnimation || "idleDown"; 
        this.currentAnimationFrame = 0; // which array or position within the animation array

    }

    draw(ctx) {
        const x = this.gameObject.x * 16 - 8; //x coord on canvas, -8 is to compensate for 32x32 spritesheet
        const y = this.gameObject.y * 16 - 18; //y coord on canvas, -18 is to compensate for 32x32 spritesheet
        
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y)
        //Drawing will only be done once this.isLoaded is True, when the image is done being loaded into the browser
        this.isLoaded && ctx.drawImage(this.image,
            0,0, //left cut of starting frame, top cut of starting frame
            32,32, //width of cut from sprite sheet, height of cut from sprite sheet
            x,y,
            32,32 //width of sprite to draw on canvas, height of sprite to draw on canvas
        )
    }
}