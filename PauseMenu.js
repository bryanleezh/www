class PauseMenu {
    constructor({onComplete}) {
        this.onComplete = onComplete;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("PauseMenu");
        this.element.innerHTML = (`
            <h2>Pause Menu</h2>


        `)
    }

    //Close the pausemenu
    close() {

    }

    async init(container){
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            //
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions([]);

        container.appendChild(this.element);
        
        utilities.wait(200);
        this.esc = new KeyPressListener("Escape" , () => {
            this.close();
        })
    }
}