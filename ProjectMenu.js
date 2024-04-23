class ProjectMenu {
    constructor({ projects, onComplete }) {
        this.projects = projects;
        this.onComplete = onComplete;
    }

    getOptions() {
        console.log(this.projects);
        const intermediateArray = this.projects.map(id => {
            const base = Projects[id];
            // TODO: Add picture and link to ProjectMenu
            return  {
                label: base.name,
                description: base.description,
                handler: () => {
                    // TODO: Change to relocate site to link
                    this.redirect(base.link);
                    // this.close();
                }
            }
        });

        const closeOption = {
            label: "Close",
            description: "Close the pause menu",
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
        // TODO: need to edit css to make it scrollable or at least overflow
        this.element.classList.add("overlayMenu");
        this.element.innerHTML = (`
            <h2>Projects</h2>
        `)
    }

    redirect(link) {
        window.open(link, '_blank');
    }

    close() {
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
    }
}