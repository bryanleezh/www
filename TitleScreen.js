class TitleScreen {
    constructor( {progress} ) {
        this.progress = progress;
    }

    getOptions(resolve) {
        const saveFile = this.progress.getSaveFile();
        return [
            {
                //start game
                label: "Start",
                description: "Start exploring my site!",
                handler: () => {
                    this.close();
                    resolve();
                }
            },
            //if there is a saveFile, then there will be the option to continue, otherwise there wouldnt be one
            saveFile ? {
                label: "Continue",
                description: "Continue where you left off!",
                handler: () => {
                    this.close();
                    resolve(saveFile);
                }
            } : null,
            {
                label: "Leave Game",
                description: "Explore the rest of this page maybe",
                handler: () => {
                    //maybe can have a function below to scroll past this whole game canvas
                }
            }
        ].filter(v => v); //filter will correct the length of this dictionary appropriately, if the savefile is null, the length of this will just be 2, if there is a savefile, then the length will be 3
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TitleScreen");
        this.element.innerHTML = (`
            <img class="TitleScreen_logo" src="./images/icons/veggie.png" alt="logo" />
        `)
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
    }

    init(container) {
        return new Promise(resolve => {
            this.createElement();
            container.appendChild(this.element);
            this.keyboardMenu = new KeyboardMenu();
            this.keyboardMenu.init(this.element);
            this.keyboardMenu.setOptions(this.getOptions(resolve));
        })
    }
}