class RevealText {
    constructor(config) {
        this.element = config.element; //text element that will be converted to indiv <span> for slow reveal
        this.text = config.text; //the entire text that will be converted
        this.speed = config.speed || 25; //speed that text will be revealed

        this.timeout = null;
        this.isDone = false; //flag to indicate if all the text is fully shown, to allow for enter to show full text instead of slowly waiting for everything to appear
    }
    //Removes all the settimeout and iterates through the rest of the spans and change them all to the "revealed" class so that the whole text appears straightaway
    autoComplete() {
        clearTimeout(this.timeout);
        this.isDone = true; //changes the flag to true straightaway
        this.element.querySelectorAll("span").forEach(ch => {
            ch.classList.add("revealed")
        });
    }

    //Recursive function which changes the class of the span element with the opacity from 0 to 1
    revealOneCharacter(list) {
        const ch = list.splice(0,1)[0];
        ch.span.classList.add("revealed");

        if (list.length > 0) {
            this.timeout = setTimeout( () => {
                this.revealOneCharacter(list)
            }, ch.delayAfter)
        } else {
            this.isDone = true; //changes flag to true only when all the characters are revealed∂ß
        }
    }

    init() {
        let characters = [];
        //create span element for each character in the text message and append it to the text box element
        this.text.split("").forEach( character => {
            let span = document.createElement("span");
            span.textContent = character;
            this.element.appendChild(span)

            //Add span to internal characters array
            characters.push( {
                span,
                delayAfter: character === " " ? 0 : this.speed, //if there is a space, there wont be a delay, it will just show the next character
            })
        })

        this.revealOneCharacter(characters);
    }
}