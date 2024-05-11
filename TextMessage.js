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
        <p class="TextMessage_p"></p>
        <button class="TextMessage_button">Next</button>
        `);

        //Initialize slow text effect on the text message itself, which converts all the text characters into indiv span elements
        this.revealText = new RevealText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text,
        })

        this.element.querySelector("button").addEventListener("click", () => {
            //Close text message
            this.done();
        });

        this.actionListener = new KeyPressListener( "Space", () => {
            this.done(); //calls function below
        });

        // mobile inputs
        document.getElementById("apadAction").addEventListener("touchstart", e=> {
            this.done();
        });

        document.getElementById("apadCancel").addEventListener("touchstart", e=> {
            this.done();
        });
    }

    //removes whole textMessage element
    done() {
        if (this.revealText.isDone){ //if the whole reveal text is completed
            this.element.remove(); //removes the text element
            this.actionListener.unbind(); //removes the eventListener for enter key
            this.onComplete(); //changes flag
        } else { //if the revealing of text is not completed and player presses enter key, the rest of the text will immediately show
            this.revealText.autoComplete(); //immediately shows all the text
        }
        
    }

    //Appends the element into a container which will be put on the HTML file to be shown on screen
    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealText.init();
    }

}