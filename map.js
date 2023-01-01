class Map{
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init() {
        console.log("map testing", this);
        const image = new Image();
        image.onload = () => {
            // drawImage takes in context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = "./images/maps/DemoLower.png";
        

        const x = 5; //coords based on x-coord of map
        const y = 6; // coords based on y-coord of map

        const shadow = new Image();
        shadow.onload = () => {
            this.ctx.drawImage(
                shadow,
                0, //left cut of starting frame
                0, // top cut of starting frame
                32, //width of cut from sprite sheet
                32, //height of cut from sprite sheet
                x * 16 - 8, //x coord on canvas, -8 is to compensate for 32x32 spritesheet
                y * 16 - 18, //y coord on canvas, -18 is to compensate for 32x32 spritesheet
                32, //width of sprite to draw on canvas
                32 //height of sprite to draw on canvas
            )
        }
        shadow.src = "./images/characters/shadow.png"

        const main = new Image();
        main.onload = () => {
            this.ctx.drawImage(
                main,
                0, //left cut of starting frame
                0, // top cut of starting frame
                32, //width of cut from sprite sheet
                32, //height of cut from sprite sheet
                x * 16 - 8, //x coord on canvas, -8 is to compensate for 32x32 spritesheet
                y * 16 - 18, //y coord on canvas, -18 is to compensate for 32x32 spritesheet
                32, //width of sprite to draw on canvas
                32 //height of sprite to draw on canvas
            )
        }
        main.src = "./images/characters/people/main_character.png"
    }
}