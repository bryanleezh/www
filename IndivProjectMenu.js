// * For passing in info on name, description, image and logo of indiv project
// TODO: IndivProjectMenu

class IndivProjectMenu {
    constructor({ project, onComplete }) {
        // CAn put this as just one project instead of an array
        this.project = project;
        this.onComplete = onComplete;
    }

    getOptions() {
        // TODO: Add info on img and logo
        const base = Projects[this.project];
        return [{
            label: base.name,
            description: base.description,
            handler: () => {
                this.close();
            }
        }]
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("ProjectMenu");
        this.element.classList.add("overlayMenu");
        // TODO: Edit header for project menu to be project name
        const proj = Projects[this.project];
        console.log(this.project);
        this.element.innerHTML = (`
            <h2>${proj.name}</h2>
        `)
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        this.keyboardMenu = new ProjectKeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions())

        container.appendChild(this.element);
    }
}