class PauseMenu {
    constructor({progress, onComplete}) {
        this.progress = progress;
        this.onComplete = onComplete;
    }

    getOptions(pageKey) {

        if (pageKey === "root") {
            return [
                // {
                //     label : "Exit Game",
                //     description: "Exit the game and see more of this website!",
                //     handler: () => {
                //         //have scrolling animation to another part of the site?
                //     }
                // },
                {
                    label: "Github",
                    description: "Access Bryan's Github profile",
                    handler: () => {
                        this.redirect("https://github.com/bryanleezh");
                    }
                },
                {
                    label: "LinkedIn",
                    description: "Access Bryan's LinkedIn profile",
                    handler: () => {
                        this.redirect("https://www.linkedin.com/in/leezhihaobryan");
                    }
                },
                // TODO: Add resume
                // {
                //     label: "Download Resume",
                //     description: "Download Bryan's resume here!",
                //     handler: () => {
                //         this.redirect("");
                //     }
                // },
                {
                    label : "Save",
                    description: "Save the game in current map",
                    handler: () => {
                        this.progress.save();
                        this.close();
                    }
                },
                {
                    label: "Close",
                    description: "Close the pause menu",
                    handler: () => {
                        this.close();
                    }
                }
            ]
        }

        return [];
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("PauseMenu");
        this.element.classList.add("overlayMenu");
        this.element.innerHTML = (`
            <h2>Pause Menu</h2>
        `)
    }

    // redirect to separate link
    redirect(link) {
        window.open(link, '_blank');
    }

    //Close the pausemenu
    close() {
        //if the escape key binding exists, unbind the key
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    async init(container){
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            //for description box
            descriptionContainer : container,
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));

        container.appendChild(this.element);
        
        // have a delay to prevent escape key from leaving the menu without it getting to open 1st
        utilities.wait(200);
        this.esc = new KeyPressListener("Escape" , () => {
            this.close();
        })
    }
}