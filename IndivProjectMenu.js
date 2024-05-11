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
        // all options for the project
        return [
            {
                label: base.name,
                handler: () => {
                    // this.close();
                }
            },
            {
                img: base.src,
                handler: () => {
                    // this.close();
                }
            },
            {
                description: base.description,
                handler: () => {
                    // this.close();
                }
            },
            {
                link: base.link,
                handler: () => {
                    this.redirect(base.link);
                }
            },
            {
                techstack: base.techstack,
                handler: () => {
                    // this.close();
                }
            },
            {
                label: "Close",
                description: "Close the menu",
                handler: () => {
                    this.close();
                }
            }
        ]
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("indivProjectMenu");

        const proj = Projects[this.project];

        this.element.innerHTML = (`
            <h2>${proj.name}</h2>
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
        this.keyboardMenu = new ProjectKeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions())

        container.appendChild(this.element);
        
        // bind escape key to leaving the project menu
        // have a delay to prevent escape key from leaving the menu without it getting to open 1st
        utilities.wait(200);
        if (!utilities.isMobile()) {
            this.esc = new KeyPressListener("Escape" , () => {
                this.close();
            })
        } else {
            document.getElementById("apadCancel").addEventListener("click", () => {
                this.close();
            })
        }
    }
}