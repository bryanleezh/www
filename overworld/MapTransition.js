//Creates the element and container for the mapTransition

class MapTransition {
    constructor() {
        this.element = null;
    }
    createElement(){
        this.element = document.createElement("div");
        this.element.classList.add("mapTransition");
    }

    //adds the class fade-out to the element, which will initiate the transition fade-out, and after it ends remove the element so that it will go back to the game itself
    fadeOut(){
        this.element.classList.add("fade-out");
        this.element.addEventListener("animationend", () => {
            this.element.remove(); //removes element
        }, {once: true}) //once allows for this event to only happen once instead of constantly transitioning
    }

    //callback is to let the function know when the transition in is done
    init(container, callback) {
        this.createElement();
        container.appendChild(this.element);

        this.element.addEventListener("animationend", () => {
            callback();
        }, {once: true}) //once allows for this event to only happen once instead of constantly transitioning
    }
}