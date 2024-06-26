//Creates a menu on screen that uses up and down keys to navigate, can be called recursively when wanting to enter menu within menus
class KeyboardMenu {
    //if config is not provided, it will default to be empty
    constructor(config={}){
        this.options = []; //Options will be set up using setOptions()
        this.up = null; //Keybinding for up arrow using keypresslistener 
        this.down = null; //Keybinding for down arrow using keypresslistener
        this.prevFocus = null; //For last focused option highlighted by player
        this.descriptionContainer = config.descriptionContainer || null;
    }

    setOptions(options) {
        this.options = options;
        this.element.innerHTML = this.options.map((option, index) => { //use index to keep track of which option was clicked
            const disabledAttr = option.disabled ? "disabled" : ""; //if the option config does not specify that it is disabled then it will jsut be a button
            if (option.label == "Close") {
                return (`
                    <div class="option">
                        <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
                            <span>${option.label}</span>
                        </button>
                        <span class="right">${option.right ? option.right() : ""}<span>
                    </div>
                `)
            } else {
                return (`
                    <div class="option">
                        <button ${disabledAttr} data-button="${index}" data-description="${option.description}">
                            ${option.label}
                        </button>
                        <span class="right">${option.right ? option.right() : ""}<span>
                    </div>
                `)}
        }).join("")

        this.element.querySelectorAll("button").forEach(button => {
            button.addEventListener("click", () => {
                const chosenOption = this.options[Number(button.dataset.button)]; //finds the button that is being chosen by the player since each button has the data-button with its particular index
                chosenOption.handler(); //uses the handler that is within the options config
            })
            
            button.addEventListener("mouseenter", () => {
                button.focus();
            })
            button.addEventListener("focus", () => {
                this.prevFocus = button; //update the most recent button that was focused on so that even when u r not focusing on any of the options, it will show the description of the last focused button
                this.descriptionElementText.innerText = button.dataset.description; //description text will be from the description that was put in the button data-description
            })
        })

        document.getElementById("apadAction").addEventListener("click", this.apadActionEventListener);

        //Focus on the 1st option that is not disabled
        setTimeout(() => {
            this.element.querySelector("button[data-button]:not([disabled])").focus(); 
        },10)

    }
    
    //creates the div element for the menu itself
    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("KeyboardMenu");

        //description element
        this.descriptionElement = document.createElement("div");
        this.descriptionElement.classList.add("DescriptionBox");
        this.descriptionElement.innerHTML = (`<p></p>`);
        this.descriptionElementText = this.descriptionElement.querySelector("p"); //references whatever p tag that is currently being focused on in the options
    }
    
    //Basically unbinds the up and down arrow keys and deletes/ends the keyboard menu
    end() {
        //removes all elements related to menu
        this.element.remove();
        this.descriptionElement.remove();
        //unbinds all keys
        if (!utilities.isMobile()) {
            this.up.unbind();
            this.down.unbind();
        } else {
            // remove event listeners for up and down
            this.up - null;
            this.down = null;
            document.getElementById("dpadUp").removeEventListener("click", this.dpadUpEventListener);
            document.getElementById("dpadDown").removeEventListener("click", this.dpadDownEventListener);
            document.getElementById("apadAction").removeEventListener("click", this.apadActionEventListener);
        }
    }

    removeDesc() {
        this.descriptionElement.remove();
    }

    createDesc() {
        this.descriptionElement = document.createElement("div");
        this.descriptionElement.classList.add("DescriptionBox");
        this.descriptionElement.innerHTML = (`<p></p>`);
        this.descriptionElementText = this.descriptionElement.querySelector("p"); //references whatever p tag that is currently being focused on in the options
    }

    apadActionEventListener = () => {
        const chosenOption = this.options[Number(this.prevFocus.dataset.button)];
        chosenOption.handler();
    }

    dpadUpEventListener = () => {
        const current = Number(this.prevFocus.getAttribute("data-button"));
        //get the array of all the buttons that has "data-button", reverses the whole array and then finds smth
        const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => { 
            return el.dataset.button < current && !el.disabled //return true if the button index is more than the current button and the button is not disabled
        })
        prevButton?.focus();
    }

    dpadDownEventListener = () => {
        const current = Number(this.prevFocus.getAttribute("data-button"));
        //get the array of all the buttons that has "data-button" and then finds smth
        const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => { 
            return el.dataset.button > current && !el.disabled //return true if the button index is more than the current button and the button is not disabled
        })
        nextButton?.focus(); //if nextButton returns true, we will focus on that next button
    }

    init(container) {
        this.createElement();
        //if this.descriptionContainer exists, it will use that, but otherwise it will default to container and then append to the descriptionElement
        (this.descriptionContainer || container).appendChild(this.descriptionElement);
        container.appendChild(this.element);

        // Check for type of inputs needed
        if (!utilities.isMobile()) {
            // keyboard inputs
            this.up = new KeyPressListener("ArrowUp", () => {
                const current = Number(this.prevFocus.getAttribute("data-button"));
                //get the array of all the buttons that has "data-button", reverses the whole array and then finds smth
                const prevButton = Array.from(this.element.querySelectorAll("button[data-button]")).reverse().find(el => { 
                    return el.dataset.button < current && !el.disabled //return true if the button index is more than the current button and the button is not disabled
                })
                prevButton?.focus();
            });

            this.down = new KeyPressListener("ArrowDown", () => {
                const current = Number(this.prevFocus.getAttribute("data-button"));
                //get the array of all the buttons that has "data-button" and then finds smth
                const nextButton = Array.from(this.element.querySelectorAll("button[data-button]")).find(el => { 
                    return el.dataset.button > current && !el.disabled //return true if the button index is more than the current button and the button is not disabled
                })
                nextButton?.focus(); //if nextButton returns true, we will focus on that next button
            });
        } else {
            // mobile inputs
            this.up = document.getElementById("dpadUp").addEventListener("click", this.dpadUpEventListener);
            this.down = document.getElementById("dpadDown").addEventListener("click", this.dpadDownEventListener);
        }
    }
}