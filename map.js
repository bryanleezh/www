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
        

        //Game Objects
        const main = new GameObject({
            x : 5,
            y : 6,
        })
        const npc1 = new GameObject({
            x : 7,
            y : 9,
            src : "./images/characters/people/npc1.png"
        })

        setTimeout( () => {
            main.sprite.draw(this.ctx)
            npc1.sprite.draw(this.ctx)
        }, 200)
        
    }
}