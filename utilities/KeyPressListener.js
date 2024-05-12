//prevents holding down of a key which will keep allowing for the same key to be spammed and having constant inputs of it

class KeyPressListener {
    constructor( keyCode, callback) {
        let keySafe = true; //to allow the certain key to work only once when pressed, and this flag will only return to true again once the key pressed is unpressed
        //basically on keydown function in vuejs, if the key pressed matches the key we need this function will run
        this.keydownFunction = function (event) {
            if (event.code === keyCode) {
                if (keySafe) {
                    keySafe = false;
                    callback();
                }
            }
        };
        //basically on keyup function in vuejs, if the key unpressed matches, this function will run and the flag will go back to true
        this.keyupFunction = function(event) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        };
        //this addEventListener allows for the whole page to run with this particular function itself if necessary
        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFunction);
    }
    //removes the keybind events once no longer needed
    unbind() {
        document.removeEventListener("keydown", this.keydownFunction);
        document.removeEventListener("keyup", this.keyupFunction);
    }
}