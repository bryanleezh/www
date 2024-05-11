class DirectionInput {
    constructor() {
        this.heldDirections = [];

        this.map = {
            "ArrowUp" : "up",
            "KeyW" : "up",
            "ArrowDown" : "down",
            "KeyS" : "down",
            "ArrowLeft" : "left",
            "KeyA" : "left",
            "ArrowRight" : "right",
            "KeyD" : "right",
        }
    }

    get direction() {
        return this.heldDirections[0];
    }

    init() {
        // keyboard directions
        document.addEventListener("keydown", e => {
            const dir = this.map[e.code];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir); // when correct key is pressed, it will be added to the start of the list
            }
        });
        document.addEventListener("keyup", e => {
            const dir = this.map[e.code];
            const index = this.heldDirections.indexOf(dir);
            if (index > -1) {
                this.heldDirections.splice(index,1);
            }
        });

        // mobile directions
        document.getElementById("dpadUp").addEventListener("touchstart", e => {
            const dir = this.map["ArrowUp"];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
            }
        });
        document.getElementById("dpadDown").addEventListener("touchstart", e => {
            const dir = this.map["ArrowDown"];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
            }
        });
        document.getElementById("dpadLeft").addEventListener("touchstart", e => {
            const dir = this.map["ArrowLeft"];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
            }
        });
        document.getElementById("dpadRight").addEventListener("touchstart", e => {
            const dir = this.map["ArrowRight"];
            if (dir && this.heldDirections.indexOf(dir) === -1) {
                this.heldDirections.unshift(dir);
            }
        });
        // cancels all directions once touch ends
        document.addEventListener('touchend', e => {
            this.heldDirections = [];
        });
    }
}