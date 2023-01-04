class TextMessage {
    constructor( {text, onComplete} ) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    //creates text element for the text that will be outputted
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
        <p class="TextMessage_p">${this.text}</p>
        <button class="TextMessage_button">Next</button>
        `)

        this.element.querySelector("button").addEventListener("click", () => {
            //Close text message
            this.done();
        });

        this.actionListener = new KeyPressListener( "Enter", () => {
            this.actionListener.unbind(); //removes the eventListener for enter key
            this.done();
        })
    }

    //removes whole textMessage element
    done() {
        this.element.remove();
        this.onComplete();
    }

    //Appends the element into a container which will be put on the HTML file to be shown on screen
    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}