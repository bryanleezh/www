class ProjectMenu {
    constructor({ projects, pcType, onComplete }) {
        this.projects = projects;
        this.onComplete = onComplete;
        this.pcType = pcType;
    }

    getOptions() {
        const intermediateArray = this.projects.map(id => {
            var base = Projects[id];
            // instantiate base on pc type: project, work, skills
            if (this.pcType === "project") {
                base = Projects[id];
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
            } else if (this.pcType === "work") {
                base = Work[id];
                return  {
                    label: base.name,
                    description: base.techstack,
                    handler: () => {
                        this.redirect(base.link);
                    }
                }
            } else if (this.pcType === "skills") {
                base = Skills[id];

                return {
                    label: `${id}`,
                    description: "",
                    handler: () => {
                        this.keyboardMenu.setOptions( this.getMoreOptions(Skills,id, finalArray) );
                    }
                }
            }
        });

        const closeOption = {
            label: "Close",
            description: "Close this menu",
            handler: () => {
                this.close();
            }
        };

        // Concatenate the additional object to the intermediate array
        const finalArray = intermediateArray.concat(closeOption);
        
        return finalArray;
    }

    getMoreOptions(page, id, prevOptions) {
        const intermediateArray = page[id].map(option => {
            return {
                label: option.name,
                description: option.description,
                handler: () => {
                    this.redirect(option.link);
                }
            }
        });

        const closeOption = {
            label: "Close",
            description: "Close this menu",
            handler:() => {
                // returns to prev options
                this.keyboardMenu.setOptions(prevOptions);
            }
        };

        const finalArray = intermediateArray.concat(closeOption);

        return finalArray;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("ProjectMenu");
        this.element.classList.add("projectMenu");
        if (this.pcType === "project") {
            this.element.innerHTML = (`
                <h2>Projects</h2>
            `);
        } else if (this.pcType === "work") {
            this.element.innerHTML = (`
                <h2>Work Experiences</h2>
            `);
        } else if (this.pcType === "skills") {
            this.element.innerHTML = (`
                <h2>Skills</h2>
            `);
        }
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