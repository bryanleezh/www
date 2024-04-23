class ProjectMenu {
    constructor({ projects, onComplete }) {
        this.projects = projects;
        this.onComplete = onComplete;
    }

    getOptions() {
        const intermediateArray = this.projects.map(id => {
            const base = Projects[id];
            return  {
                label: base.name,
                description: base.description,
                handler: () => {
                    // this.close();
                    this.keyboardMenu.removeDesc();
                    const menu = new IndivProjectMenu({
                        project: id,
                        onComplete: () => {
                            // resolve();
                            // this.keyboardMenu.init();
                        }
                    });
                    menu.init(document.querySelector(`.game-container`));
                }
            }
        });

        const closeOption = {
            label: "Close",
            description: "Close the projects menu",
            handler: () => {
                this.close();
            }
        };

        // Concatenate the additional object to the intermediate array
        const finalArray = intermediateArray.concat(closeOption);
        
        return finalArray;
    }


    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("ProjectMenu");
        this.element.classList.add("projectMenu");
        this.element.innerHTML = (`
            <h2>Projects</h2>
        `)
    }

    redirect(link) {
        window.open(link, '_blank');
    }

    close() {
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions())

        container.appendChild(this.element);

        // bind escape key to leaving the project menu
        // have a delay to prevent escape key from leaving the menu without it getting to open 1st
        utilities.wait(200);
        this.esc = new KeyPressListener("Escape" , () => {
            this.close();
        })
    }
}