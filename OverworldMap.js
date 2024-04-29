class OverworldMap {
    constructor(config) {
        //empty in initial state, but will change once map is initialised
        this.overworld = null; 
        //Live objects of all the classes
        this.gameObjects ={}; 
        //All the config of all the characters
        this.configObjects = config.configObjects; 


        //if there is no cutsceneSpaces listed, default to empty
        this.cutsceneSpaces = config.cutsceneSpaces || {}; 
        this.walls = config.walls || {};

        //actual map
        this.lowerImage = new Image(); 
        this.lowerImage.src = config.lowerSrc;
        
        // all the upper portions of the map
        this.upperImage = new Image(); 
        this.upperImage.src = config.upperSrc;

        this.cutScene = false;
        this.isPause = false;

    }

    drawLowerImage(ctx, camera) {
        ctx.drawImage(this.lowerImage,
                    utilities.withGrid(10.5) - camera.x,
                    utilities.withGrid(6) - camera.y);
    }

    drawUpperImage(ctx, camera) {
        ctx.drawImage(this.upperImage,
                    utilities.withGrid(10.5) - camera.x,
                    utilities.withGrid(6) - camera.y);
    }
    //if it is a wall that is found from this.walls, function will return true, otherwise it will just be false
    isCollided (currentX, currentY, direction){
        const {x,y} = utilities.nextPosition(currentX, currentY, direction);
        if (this.walls[`${x},${y}`]) {
            return true;
        }
        //Check for game objects at this position
        return Object.values(this.gameObjects).find(obj => {
            if (obj.x === x && obj.y === y) { return true; }
            if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition[1] === y ) {
                return true
            }
            return false;
        })
    }

    //loops through all gameObjects and mounts all the gameObjects being loaded into the current screen
    mountObjects() {
        Object.keys(this.configObjects).forEach(key => {
            
            let object = this.configObjects[key];
            //id of the object will be the name given to the object such as player,npc1,npc2 etc
            object.id = key; 
            //create the game instance of class from gameconfig object
            let instance;
            if (object.type === "Character") {
                instance = new Character(object);
            }
            if (object.type === "ProjectPc") {
                instance = new ProjectPc(object);
            }
            if (object.type === "IndivProjectArcade") {
                instance = new IndivProjectArcade(object);
            }
            //TODO: Add other object types if we end up adding other things in

            this.gameObjects[key] = instance;
            this.gameObjects[key].id = key;
            instance.mount(this);
        })
    }

    async startCutscene(events){ //events would be an array
        this.cutScene = true;

        //Start loop of async events
        //Await each one
        for (let i=0; i<events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map : this,
            })
            //wait for all the events in the loop to finish before initialising the event
            await eventHandler.init(); 
        }

        //Once cutscene is done, the cutScene flag will be set back to false and everyone's movement will be back to normal
        this.cutScene = false; 

        //Reset npc behaviour
        // Object.values(this.gameObjects).forEach(object => object.doBehaviourEvent(this));
    }

    checkForActionCutscene() {
        const main = this.gameObjects["main"];
        const nextCoords = utilities.nextPosition(main.x, main.y, main.direction); //checks coord in front of the main character to see if there is any gameObject to interact with
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
        });

        if (!this.cutScene && match && match.talking.length) {
            const relevantScenario = match.talking.find(scenario => {
                //iterates through everything and all items must pass certain req before this can return true
                return (scenario.required || []).every(storyflag => { //if there is no relevant scenario, it will just be an empty array
                    return playerState.storyFlags[storyflag];
                }) 
            });

            relevantScenario && this.startCutscene(relevantScenario.events);
        }
    }

    checkForFootstepCutscene() {
        const main = this.gameObjects["main"];
        //if the coords the main character is stepping on matches the coords specified in cutSceneSpaces, it will show the objects events in that coord
        const match = this.cutsceneSpaces[`${main.x},${main.y}`]; 
        if (!this.cutScene && match) {
            const relevantScenario = match.find(scenario => {
                //iterates through everything and all items must pass certain req before this can return true
                return (scenario.required || []).every(storyflag => { //if there is no relevant scenario, it will just be an empty array
                    return playerState.storyFlags[storyflag];
                }) 
            });
            relevantScenario && this.startCutscene(relevantScenario.events);
        }
    }

    // addWall(x,y) {
    //     this.walls[`${x},${y}`] = true;
    // }

    // removeWall(x,y) {
    //     delete this.walls[`${x},${y}`];
    // }
    // //removes wall at current x & y coord, locates the next position it will be after moving, then add the wall at that next coord
    // moveWall(wasX,wasY,direction){
    //     this.removeWall(wasX,wasY);
    //     const {x,y} = utilities.nextPosition(wasX,wasY,direction);
    //     this.addWall(x,y);
    // }

    
}

window.OverworldMaps = {
    StartTruck: {
        id: "StartTruck",
        lowerSrc: "./images/maps/starting_truck_lower.png",
        upperSrc: "./images/maps/starting_truck_upper.png",
        configObjects: {
            main : {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(3),
                y : utilities.withGrid(3),
            },
            main_character: {
                type: "Character",
                x : utilities.withGrid(5),
                y : utilities.withGrid(3),
                src : "./images/characters/people/main_character.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 800},
                    {type : "stand", direction : "right", time : 800},
                    {type : "stand", direction : "down", time : 300},
                ],
            }
        },
        walls: function() {
            let walls  = {};
            [
                "2,2","2,3","2,4","3,2","3,4"
            ].forEach(coord => {
                let [x,y] = coord.split(",");
                walls[utilities.gridCoord(x,y)] = true;
            })
            return walls;
        }(),
        cutsceneSpaces: {
            // Opening introduction
            [utilities.gridCoord(4,3)] : [
                    {
                        events: [
                            { type: "textMessage", text: "Hey! Welcome to my world!" , faceMain: "main_character"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "I am excited to show you whatI have built so far!"},
                            { type: "textMessage", text: "As you step out,you will be able to explore all the buildings"},
                            { type: "textMessage", text: "Additionally, the projects arcade is finally open, so be sure to go check it out!"},
                            { type: "textMessage", text: "If you are lost or unsure of what each building represents,feel free to interact with anyone around!"},
                            { who: "main_character" ,type: "walk", direction: "right" },
                            { who: "main_character" ,type: "walk", direction: "down" },
                            { who: "main_character" ,type: "stand", direction: "up" },
                            { who:"main", type : "walk", direction : "right"},
                            { who:"main", type : "walk", direction : "right"},
                            { 
                                type : "changeMap", 
                                map: "MainMap",
                                x: utilities.withGrid(21),
                                y: utilities.withGrid(14),
                                direction: "right",
                            }
                        ]
                    }
                ],
        }
    },
    MainMap : {
        id : "MainMap",
        lowerSrc : "./images/maps/main_map_lower.png",
        upperSrc : "./images/maps/main_map_upper.png",
        configObjects : {
            main : {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(14),
                y : utilities.withGrid(13),
            },
            npc1: {
                type: "Character",
                x : utilities.withGrid(6),
                y : utilities.withGrid(13),
                src : "./images/characters/people/main_character.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 800},
                    {type : "stand", direction : "down", time : 800},
                    {type : "stand", direction : "right", time : 1200},
                    {type : "stand", direction : "down", time : 300},
                ],
                talking: [
                    {
                        required: ["TALKED_TO_SOMEONE"],
                        events: [
                            { type: "textMessage", text: "Hello r u new here?" , faceMain: "npc1"},
                        ]
                    },
                    {
                        events: [
                            { type: "textMessage", text: "This building right here has more information about my background" , faceMain: "npc1"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "so head on in if you want to know more about me!"},
                            // {who:"main", type : "walk", direction : "left"},
                        ]
                    },
                ]
            },
            //woman walking up and down 
            npc2: {
                type: "Character",
                x : utilities.withGrid(21),
                y : utilities.withGrid(12),
                src : "./images/characters/people/npc1.png",
                behaviourLoop : [ //basic npc movement
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                ],
                talking: [
                    {
                        events: [
                            {type:"textMessage", text:"Move out of the way! I'm trying to get to the washroom!", faceMain:"npc2"},
                            // {type: "addStoryFlag", flag: "TALKED_TO_SOMEONE"},
                        ]
                    }
                ]
            },
            //Copman
            npc3: {
                type: "Character",
                x : utilities.withGrid(26),
                y : utilities.withGrid(8),
                src : "./images/characters/people/cop_npc.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 800},
                    {type : "stand", direction : "down", time : 800},
                    {type : "stand", direction : "right", time : 1200},
                    {type : "stand", direction : "down", time : 300},
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hey! On your right is the projects arcade!" , faceMain: "npc3"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "Enter this building here to see the past projects that Bryan has done!"},
                        ]
                    },
                ]
            },
            //Biker
            npc4: {
                type: "Character",
                x : utilities.withGrid(14),
                y : utilities.withGrid(14),
                src : "./images/characters/people/biker.png",
                behaviourLoop : [ //basic npc movement
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                ],
                talking: [
                    {
                        events: [
                            {type:"textMessage", text:"Have you checked out the HUB?", faceMain:"npc4"},
                            {type:"textMessage", text:"You can find all of Bryan's socials in there, it's right up here!"},
                            // {type: "addStoryFlag", flag: "TALKED_TO_SOMEONE"},
                        ]
                    }
                ]
            },
            //Projects bulding bouncer
            npc5: {
                type: "Character",
                x : utilities.withGrid(30),
                y : utilities.withGrid(13),
                src : "./images/characters/people/cop_npc.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 500},
                    {type : "stand", direction : "down", time : 1000},
                    {type : "stand", direction : "right", time : 800},
                    {type : "stand", direction : "down", time : 1200},
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hey! This building right here is the projects arcade." , faceMain: "npc5"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "Step right in to see all of Bryan's projects!"},
                        ]
                    },
                ]
            },
            // PC that lists all projects
            // projectsPc: {
            //     type: "ProjectPc",
            //     x : utilities.withGrid(28),
            //     y : utilities.withGrid(13),
            //     src : "./images/objects/projectpc.png",
            //     pcType: "project",
            //     projects: [
            //         "Money-Pig", 
            //         "Access-Logger", 
            //         "Portfolio-Manager", 
            //         "Algo-Visualizer", 
            //         "Club-Management", 
            //         "PyPlatformer"
            //     ],
            // }
        },
        walls: function() {
            let walls  = {};
            [
                "1,1","1,2","1,3","1,4","1,5","1,6","1,7","1,8","1,9","1,10","1,11","1,12","1,13","1,14","1,15","1,16",
                "2,1","3,1","4,1","5,1","6,1","7,1","8,1","9,1","10,1","11,1","12,1","13,1","14,1","15,1","16,1","17,1","18,1","19,1","20,1","21,1","22,1","23,1","24,1","25,1","26,1","27,1","28,1","29,1","30,1","31,1",
                "2,17","3,17","4,17","5,17","6,17","7,17","8,17","9,17","10,17","11,17","12,17","13,17","14,17","15,17","16,17","17,17","18,17","19,17","20,17","21,17","22,17","23,17","24,17","25,17","26,17","27,17","28,17","29,17",
                "30,3","30,4","30,5","31,3","31,4","31,5","32,1","32,2","32,3","32,4","32,5","32,6","32,7","32,8","32,9","32,10","32,11","32,12","32,13","31,14","30,14","30,15","30,16",
                "3,4","4,4","5,4","3,5","4,5","5,5","2,6","3,6","4,6","5,6","9,6","21,6","26,6",
                "19,7","20,7","27,7","28,7","29,7","30,7","31,7",
                "3,8","4,8","5,8","6,8","7,8","8,8","9,8","10,8","19,8","20,8","27,8","31,8",
                "3,9","10,9","19,9","20,9","22,9","23,9","27,9","31,9",
                "3,10","10,10","11,10","12,10","13,10","14,10","15,10","16,10","17,10","18,10","19,10","20,10","22,10","23,10","27,10","31,10",
                "3,11","11,11","12,11","13,11","14,11","15,11","16,11","17,11","19,11","20,11","27,11","31,11",
                "3,12","5,12","6,12","7,12","8,12","9,12","10,12","11,12","12,12","15,12","16,12","17,12","18,12","27,12","28,12","30,12","31,12",
                "17,14","18,14","19,14","20,14",
                "19,12","20,12",
            ].forEach(coord => {
                let [x,y] = coord.split(",");
                walls[utilities.gridCoord(x,y)] = true;
            })
            return walls;
        }(),
        cutsceneSpaces :{
            // house
            [utilities.gridCoord(4,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "MyHouse",
                            x: utilities.withGrid(3),
                            y: utilities.withGrid(9),
                            direction: "up",
                        }
                    ]
                }
            ],
            // Hub
            [utilities.gridCoord(13,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "Hub",
                            x: utilities.withGrid(10),
                            y: utilities.withGrid(17),
                            direction: "up",
                        }
                    ]
                }
            ],
            // Hub
            [utilities.gridCoord(14,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "Hub",
                            x: utilities.withGrid(11),
                            y: utilities.withGrid(17),
                            direction: "up",
                        }
                    ]
                }
            ],
            // Project building
            [utilities.gridCoord(29,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "ProjectBuilding",
                            x: utilities.withGrid(9),
                            y: utilities.withGrid(13),
                            direction: "up",
                        }
                    ]
                }
            ],
        }
    },
    MyHouse : {
        id : "MyHouse",
        lowerSrc: "./images/maps/housebottomfloor_lower.png",
        upperSrc: "./images/maps/housebottomfloor_upper.png",
        configObjects: {
            main: {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(3),
                y : utilities.withGrid(10),
            },
            // TODO: Update laptop to have keyboard menu
            laptop: {
                type: "Character",
                x : utilities.withGrid(13),
                y : utilities.withGrid(9),
                src: "./images/characters/laptop_room.png",
                behaviourLoop :[
                    {type : "stand", direction: "left", time: 1200},
                ],
                talking: [ 
                    {
                        events: [
                            { type: "textMessage", text: "Log: I am currently proficient in Python, Java, TypeScript, JavaScript and SQL"},
                            { type: "textMessage", text: "Tech & Libraries: React.js, Next.js, Vue.js, AWS, Node.js,SpringBoot, Flask, Firebase, MongoDB."}
                        ]
                    }
                ]
            },
            me: {
                type: "Character",
                x : utilities.withGrid(8),
                y : utilities.withGrid(5),
                src : "./images/characters/people/main_character.png",
                behaviourLoop : [
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "left"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hey,it's me again,seems like you managed to find your way here." , faceMain: "me"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "I am currently an undergraduate at Singapore Management University,pursuing a degree in Information Systems."},
                            { type: "textMessage", text: "I will be specialising in Digitalisation & Cloud Solutions, with the intention of pursuing a full-stack or"},
                            { type: "textMessage", text: "software engineering role in the future."},
                            { type: "textMessage", text: "For my technical skills,you can access it from the laptop at the bottom right of my house."},
                        ]
                    },
                ]
            },
            npc1: {
                type: "Character",
                x : utilities.withGrid(4),
                y : utilities.withGrid(3),
                src : "./images/characters/people/npc2.png",
                behaviourLoop : [
                    {type : "stand", direction : "right", time : 1200},
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Sorry! This upper floor is still under construction." , faceMain: "npc1"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "Please come back at a later date once it is done!"},
                            {who:"main", type : "walk", direction : "down"},
                        ]
                    },
                ]
            },
            npc2: {
                type: "Character",
                x : utilities.withGrid(4),
                y : utilities.withGrid(4),
                src : "./images/characters/people/npc2.png",
                behaviourLoop : [
                    {type : "stand", direction : "right", time : 1200},
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Sorry! This upper floor is still under construction." , faceMain: "npc1"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "Please come back at a later date once it is done!"},
                            {who:"main", type : "walk", direction : "down"},
                        ]
                    },
                ]
            },
        },
        walls: function() {
            let walls  = {};
            [
               "1,0","1,1","1,2","1,3","1,4","1,5","1,6","1,7","1,8","1,9","1,10","3,11",
               "2,10","4,10","5,10","6,10","7,10","8,10","9,10","10,10","11,10","12,10","13,10","14,10",
               "2,0","3,0","4,0","5,0","6,0","7,0","8,0","9,0","10,0","11,0","12,0","13,0","14,0",
               "14,0","14,1","14,2","14,3","14,4","14,5","14,6","14,7","14,8","14,9",
                "4,2","5,2","6,2","7,2","8,2","9,2","10,2","11,2","12,2","13,2",
                "7,3","8,3","9,3","11,3","13,3",
                "2,4","3,4","11,4","2,5","3,5","4,5","13,6","4,7","5,7","6,7",
                "2,8","3,8","4,8","5,8","10,8","11,8","12,8","13,8","13,9"
            ].forEach(coord => {
                let [x,y] = coord.split(",");
                walls[utilities.gridCoord(x,y)] = true;
            })
            return walls;
        }(),
        cutsceneSpaces: {
            // Change map
            [utilities.gridCoord(3,10)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "MainMap",
                            x: utilities.withGrid(4),
                            y: utilities.withGrid(13),
                            direction: "down",
                        }
                    ]
                }
            ],
        },
    },
    Hub: {
        id: "Hub",
        lowerSrc: "./images/maps/my_hub_lower.png",
        upperSrc: "./images/maps/my_hub_upper.png",
        configObjects: {
            main: {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(10),
                y : utilities.withGrid(12),
            },
            me: {
                type: "Character",
                x : utilities.withGrid(10.5),
                y : utilities.withGrid(10),
                src : "./images/characters/people/main_character.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 400},
                    {type : "stand", direction : "down", time : 800},
                    {type : "stand", direction : "right", time : 1200},
                    {type : "stand", direction : "down", time : 300},
                ],
            },
            meEmptySpaceConversation1: {
                type: "Character",
                x : utilities.withGrid(10),
                y : utilities.withGrid(11),
                src: "./images/objects/empty_object.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hey, this room is where I place the people that has been a part of my journey so far." , faceMain: "me"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "I am currently in the midst of drawing out and populating them here! So come visit this world again in the near future!"},
                            { type: "textMessage", text: "This is also the main place where you can find all information about me!."},
                            { type: "textMessage", text: "On the left there is a PC that stores all my projects, and on my right it stores all my experiences."},
                            { type: "textMessage", text: "The yellow arcade machine is where all my skills and tools I use are held."},
                        ]
                    },
                ]
            },
            meEmptySpaceConversation2: {
                type: "Character",
                x : utilities.withGrid(11),
                y : utilities.withGrid(11),
                src: "./images/objects/empty_object.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hey, this room is where I place the people that has been a part of my journey so far." , faceMain: "me"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "I am currently in the midst of drawing out and populating them here! So come visit this world again in the near future!"},
                            { type: "textMessage", text: "This is also the main place where you can find all information about me!."},
                            { type: "textMessage", text: "On the left there is a PC that stores all my projects, and on my right it stores all my experiences."},
                            { type: "textMessage", text: "The yellow arcade machine is where all my skills and tools I use are held."},
                        ]
                    },
                ]
            },
            projectsPc: {
                type: "ProjectPc",
                x : utilities.withGrid(7),
                y : utilities.withGrid(10),
                pcType: "project",
                projects: [
                    "Money-Pig", 
                    "Access-Logger", 
                    "Portfolio-Manager", 
                    "Algo-Visualizer", 
                    "Club-Management", 
                    "PyPlatformer"
                ],
            },
            workPc: {
                type: "ProjectPc",
                x : utilities.withGrid(14),
                y : utilities.withGrid(10),
                pcType: 'work',
                projects: [
                    "Cybernatics", "Shopee", "WSAudiology", "Switcheo"
                ],
            },
            // TODO: Change colors of pcs
            skillsPc: {
                type: "ProjectPc",
                x : utilities.withGrid(4),
                y : utilities.withGrid(10),
                src : "./images/objects/arcade-yellow.png",
                pcType: 'skills',
                projects: [
                    "Languages", "Frameworks", "Tools"
                ],
            },
        },
        walls: function() {
            let walls  = {};
            [
                "1,8","1,9","1,10","1,11","1,12","1,13","1,14","1,15","2,16",
                "2,9","3,9","4,9","5,9","6,9","7,9","8,9","13,9","14,9","15,9","16,9","17,9","18,9","19,9",
                "2,17","3,17","4,17","5,17","6,17","7,17","8,17","9,17","12,17","13,17","14,17","15,17","16,17","17,17","18,17",
                "20,10","20,11","20,12","20,13","20,14","20,15","19,16",
                "8,10","13,10",
                "10,18","11,18",
                "8,11","9,11","10,11","11,11","12,11","13,11",
                "17,12","18,12","17,13","18,13",
                "5,15","6,15","14,15","15,15"

            ].forEach(coord => {
                let [x,y] = coord.split(",");
                walls[utilities.gridCoord(x,y)] = true;
            })
            return walls;
        }(),
        cutsceneSpaces :{
            [utilities.gridCoord(10,17)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "MainMap",
                            x: utilities.withGrid(13),
                            y: utilities.withGrid(13),
                            direction: "down",
                        }
                    ]
                }
            ],
            [utilities.gridCoord(11,17)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "MainMap",
                            x: utilities.withGrid(14),
                            y: utilities.withGrid(13),
                            direction: "down",
                        }
                    ]
                }
            ]
        }
    },
    DemoRoom: {
        id: "DemoRoom" ,
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        configObjects: {
            main: {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(5),
                y : utilities.withGrid(6),
            },
            npc1: {
                type: "Character",
                x : utilities.withGrid(7),
                y : utilities.withGrid(9),
                src : "./images/characters/people/main_character.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 800},
                    {type : "stand", direction : "down", time : 800},
                    {type : "stand", direction : "right", time : 1200},
                    {type : "stand", direction : "down", time : 300},
                ],
                talking: [
                    {
                        required: ["TALKED_TO_SOMEONE"],
                        events: [
                            { type: "textMessage", text: "Hello r u new here?" , faceMain: "npc1"},
                        ]
                    },
                    {
                        events: [
                            { type: "textMessage", text: "harassment!" , faceMain: "npc1"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "shoo!"},
                            {who:"main", type : "walk", direction : "left"},
                        ]
                    },
                ]
            },
            npc2: {
                type: "Character",
                x : utilities.withGrid(8),
                y : utilities.withGrid(5),
                src : "./images/characters/people/npc1.png",
                behaviourLoop : [ //basic npc movement
                    {type : "walk", direction : "left"},
                    {type : "stand", direction : "up", time: 800 },
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "right"},
                    {type : "walk", direction : "down"},
                ],
                talking: [
                    {
                        events: [
                            {type:"textMessage", text:"hello wats up", faceMain:"npc2"},
                            {type: "addStoryFlag", flag: "TALKED_TO_SOMEONE"},
                        ]
                    }
                ]
            },
            projectPc: {
                type: "ProjectPc",
                x : utilities.withGrid(6),
                y : utilities.withGrid(8),
                src : "./images/objects/projectpc.png",
                pcType: 'project',
                projects: [
                    "Money-Pig", 
                    "Access-Logger", 
                    "Portfolio-Manager", 
                    "Algo-Visualizer", 
                    "Club-Management", 
                    "PyPlatformer"
                ],
            },
            skillsPc: {
                type: "ProjectPc",
                x : utilities.withGrid(2),
                y : utilities.withGrid(6),
                src : "./images/objects/arcade-green.png",
                pcType: 'skills',
                projects: [
                    "Languages", "Frameworks", "Tools"
                ],
            },
            workPc: {
                type: "ProjectPc",
                x : utilities.withGrid(3),
                y : utilities.withGrid(5),
                src : "./images/objects/workpc.png",
                pcType: 'work',
                projects: [
                    "Cybernatics", "Shopee", "WSAudiology", "Switcheo"
                ],
            },
            projectArcade: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(5),
                y : utilities.withGrid(4),
                // src : "./images/characters/arcade-blue.png",
                project: "Access-Logger"
            },
            
        },
        walls: {
            [utilities.gridCoord(7,6)] : true,
            [utilities.gridCoord(8,6)] : true,
            [utilities.gridCoord(7,7)] : true,
            [utilities.gridCoord(8,7)] : true,
        },
        cutsceneSpaces :{ //when there are areas in the map where there will start a cutscene
            // [utilities.gridCoord(7,4)] : [
            //     {
            //         events: [
            //             { who: "npc2", type: "walk", direction: "left"},
            //             { who: "npc2", type: "stand", direction: "up", time: 500},
            //             { type: "textMessage", text: "You can't be in there!"},
            //             { who: "npc2", type: "walk", direction: "right"},
            //             { who: "main", type: "walk", direction: "down"},
            //             { who: "main", type : "walk", direction: "left"}
            //         ]
            //     }
            // ],
            [utilities.gridCoord(5,10)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "MainMap",
                            x : utilities.withGrid(14),
                            y : utilities.withGrid(13),
                            direction: "down",
                    }
                    ]
                }
            ]
        }

    },
    ProjectBuilding: {
        id: "ProjectBuilding" ,
        // lowerSrc: "./images/maps/projects_map_lower.png",
        lowerSrc: "./images/maps/new_proj_room_lower.png",
        upperSrc: "./images/maps/projects_map_upper.png",
        configObjects: {
            main: {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(9),
                y : utilities.withGrid(13),
            },
            // Security Guard
            securityGuard: {
                type: "Character",
                x : utilities.withGrid(10),
                y : utilities.withGrid(11),
                src : "./images/characters/people/cop_npc.png",
                behaviourLoop : [
                    {type : "stand", direction : "left", time : 800},
                    {type : "stand", direction : "down", time : 800},
                    {type : "stand", direction : "up", time : 1600},
                    {type : "stand", direction : "right", time : 1200},
                    {type : "stand", direction : "down", time : 1200},
                ],
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "Hey! Have you checked out all the cool projects Bryan has built?" , faceMain: "securityGuard"},
                            { type: "textMessage", text: "You can access all his projects straight from the table up front, but you can also access each individual project from the arcade machines too!" },
                        ]
                    }
                ]
            },
            // talking wall beside projectstable
            talkingWall1: {
                type: "Character",
                x : utilities.withGrid(8),
                y : utilities.withGrid(7),
                src : "./images/objects/empty_object.png",
                talking: [
                    {
                        required: ["SECRET_PROJ_ROOM_ACCESS"],
                        events: [
                            {type:"textMessage", text:"What?! He told you?!"},
                            {type:"textMessage", text:"Fine, you can get past this point if you walk around the arcade machines..."},
                        ]
                    },
                    {
                        events: [
                            {type:"textMessage", text:"Access past this point is prohibited!"},
                        ]
                    }
                ]
            },
            // talking wall beside projectstable
            talkingWall2: {
                type: "Character",
                x : utilities.withGrid(10),
                y : utilities.withGrid(7),
                src : "./images/objects/empty_object.png",
                talking: [
                    {
                        events: [
                            {type:"textMessage", text:"Access past this point is prohibited!"},
                            {type:"textMessage", text:"Psst, just walk around the arcade machines, there's a secret behind!"},
                            {type: "addStoryFlag", flag: "SECRET_PROJ_ROOM_ACCESS"},
                        ]
                    }
                ]
            },
            // secret on big wardrobe
            secretWardrobe: {
                type: "Character",
                x : utilities.withGrid(9),
                y : utilities.withGrid(5),
                src: "./images/objects/empty_object.png",
                talking: [
                    {   
                        required: ["SECRET_PROJ_ROOM_ACCESS"],
                        events: [
                            {type:"textMessage", text:"Bryan: Congrats! You found the secret room!"},
                            {type:"textMessage", text:"Bryan: Now behind this room is..."},
                            {type:"textMessage", text:"Bryan: Nothing! Goodbye!"},
                        ]
                    }
                ]
            },
            // PC that lists all projects
            projectsTable: {
                type: "ProjectPc",
                x : utilities.withGrid(9),
                y : utilities.withGrid(7),
                src : "./images/objects/empty_object.png",
                pcType: "project",
                projects: [
                    "Money-Pig", 
                    "Access-Logger", 
                    "Portfolio-Manager", 
                    "Algo-Visualizer", 
                    "Club-Management", 
                    "PyPlatformer"
                ],
            },
            // Money-Pig proj
            projectArcade1: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(13),
                y : utilities.withGrid(7),
                project: "Money-Pig"
            },
            // Access-Logger proj
            projectArcade2: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(12),
                y : utilities.withGrid(7),
                src : "./images/objects/arcade-wood.png",
                project: "Access-Logger"
            },
            // Portfolio-Manager proj
            projectArcade3: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(11),
                y : utilities.withGrid(7),
                src : "./images/objects/arcade-green.png",
                project: "Portfolio-Manager"
            },
            // Club-Management proj
            projectArcade4: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(5),
                y : utilities.withGrid(7),
                src : "./images/objects/arcade-yellow.png",
                project: "Club-Management"
            },
            // Algo-Visualizer proj
            projectArcade5: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(6),
                y : utilities.withGrid(7),
                src : "./images/objects/arcade-green.png",
                project: "Portfolio-Manager"
            },
            // Python Platformer proj
            projectArcade6: {
                type: "IndivProjectArcade",
                x : utilities.withGrid(7),
                y : utilities.withGrid(7),
                src : "./images/objects/arcade-blue.png",
                project: "PyPlatformer"
            },
        },
        walls: function() {
            let walls  = {};
            [
                // side walls
                "1,4", "1,5", "1,6", "1,7", "1,8", "1,9", "1,10", "1,11", "1,12", "1,13",
                "17,4", "17,5", "17,6", "17,7", "17,8", "17,9", "17,10", "17,11", "17,12", "17,13",
                "2,6", "2,7", "2,8", "2,9", "2,10", "2,11", "2,12",
                "16,6", "16,7", "16,8", "16,9", "16,10", "16,11", "16,12",
                // bottom walls
                "2,13", "3,13", "4,13", "5,13", "6,13", "7,13", "8,13", "10,13", "11,13", "12,13", "13,13", "14,13", "15,13", "16,13", 
                // remaining walls
                "2,4", "3,4", "4,4", "5,4", "6,4", "7,4", "10,4", "11,4", "12,4", "13,4", "14,4", "15,4", "16,4", 
                "8,5", "9,5", "10,5", "13,5", "14,5", "15,5",
                // left shelf beside arcade machines
                "4,8",
                // bottom left bookshelf
                "4,10", "5,10",
                // 2 shelves on the right of building
                "14,7", "14,11"
            ].forEach(coord => {
                let [x,y] = coord.split(",");
                walls[utilities.gridCoord(x,y)] = true;
            })
            return walls;
        }(),
        cutsceneSpaces: {
            // project building walkthrough
            [utilities.gridCoord(9,12)] : [
                {
                    // prevent tutorial from playing again
                    required: ["PROJECT_BUILDING_TUTORIAL"],
                    events: [
                        // empty
                    ]
                },
                // tutorial for when 1st entering projects building
                {
                    events: [
                        { who: "securityGuard" ,type: "walk", direction: "left" },
                        { type: "textMessage", text: "This is the projects building! Where all Bryan's projects are held.", faceMain: "securityGuard"},
                        { type: "textMessage", text: "Right up ahead on the main table, you can see a list of all his projects, and click on it for more information!" },
                        { type: "textMessage", text: "Each individual project is also stored on separate arcade machines! The oldest project starts from the left! Go check them out too!" },
                        { type: "textMessage", text: "Alright, I'll let you explore now, if you need anything, I'll be here!" },
                        { type: "addStoryFlag", flag: "PROJECT_BUILDING_TUTORIAL"},
                        { who: "securityGuard" ,type: "walk", direction: "right" },
                    ]
                },
            ],
            // return to main map
            [utilities.gridCoord(9,14)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "MainMap",
                            x: utilities.withGrid(29),
                            y: utilities.withGrid(13),
                            direction: "down",
                        }
                    ]
                }
            ],
        },
    }
}