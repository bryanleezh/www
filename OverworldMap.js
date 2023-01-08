class OverworldMap {
    constructor(config) {
        this.overworld = null; //empty in initial state, but will change once map is initialised
        this.gameObjects ={}; //Live objects of all the classes
        this.configObjects = config.configObjects; //All the config of all the characters


        this.cutsceneSpaces = config.cutsceneSpaces || {}; //if there is no cutsceneSpaces listed, default to empty
        this.walls = config.walls || {};

        this.lowerImage = new Image(); //actual map
        this.lowerImage.src = config.lowerSrc;
        
        this.upperImage = new Image(); // all the upper portions of the map
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
            
            let object = this.configObjects[key]
            object.id = key //id of the object will be the name given to the object such as player,npc1,npc2 etc
            //create the game instance of class from gameconfig object
            let instance;
            if (object.type === "Character") {
                instance = new Character(object);
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
            await eventHandler.init(); //wait for all the events in the loop to finish before initialising the event
        }

        this.cutScene = false; //Once cutscene is done, the cutScene flag will be set back to false and everyone's movement will be back to normal

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
        const match = this.cutsceneSpaces[`${main.x},${main.y}`]; //if the coords the main character is stepping on matches the coords specified in cutSceneSpaces, it will show the objects events in that coord
        // console.log(match);
        if (!this.cutScene && match) {
            this.startCutscene(match[0].events);
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
                            { type: "textMessage", text: "harassment!" , faceMain: "npc1"}, //faceMain allows character to face main character when interacting
                            { type: "textMessage", text: "shoo!"},
                            // {who:"main", type : "walk", direction : "left"},
                        ]
                    },
                ]
            },
            npc2: {
                type: "Character",
                x : utilities.withGrid(21),
                y : utilities.withGrid(12),
                src : "./images/characters/people/npc1.png",
                behaviourLoop : [ //basic npc movement
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "up"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                    {type : "walk", direction : "down"},
                    {type : "stand", direction : "down", time : 1200},
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
            ].forEach(coord => {
                let [x,y] = coord.split(",");
                walls[utilities.gridCoord(x,y)] = true;
            })
            console.log(walls);
            return walls;
        }(),
        cutsceneSpaces :{
            [utilities.gridCoord(4,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "DemoRoom",
                            x: utilities.withGrid(5),
                            y: utilities.withGrid(10),
                            direction: "up",
                        }
                    ]
                }
            ],
            [utilities.gridCoord(13,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "DemoRoom",
                            x: utilities.withGrid(5),
                            y: utilities.withGrid(10),
                            direction: "up",
                        }
                    ]
                }
            ],
            [utilities.gridCoord(14,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "DemoRoom",
                            x: utilities.withGrid(5),
                            y: utilities.withGrid(10),
                            direction: "up",
                        }
                    ]
                }
            ],
            [utilities.gridCoord(29,12)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "DemoRoom",
                            x: utilities.withGrid(5),
                            y: utilities.withGrid(10),
                            direction: "up",
                        }
                    ]
                }
            ],
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
    Kitchen: {
        id : "Kitchen",
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        configObjects: {
            main: {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(5),
                y : utilities.withGrid(5),
            },
            npcB: {
                type: "Character",
                x : utilities.withGrid(10),
                y : utilities.withGrid(8),
                src : "./images/characters/people/npc4.png",
                talking: [
                    {
                        events: [
                            { type: "textMessage", text: "You made it!" , faceMain: "npcB"}, //faceMain allows character to face main character when interacting
                        ]
                    },
                ]
            }
        },
        cutsceneSpaces :{
            [utilities.gridCoord(5,10)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "Street",
                            x: utilities.withGrid(29),
                            y: utilities.withGrid(9),
                            direction: "down",
                        }
                    ]
                }
            ]
        }
    },
    Street: {
        id : "Street",
        lowerSrc : "./images/maps/StreetLower.png",
        upperSrc : "./images/maps/StreetUpper.png",
        configObjects : {
            main: {
                type: "Character",
                isPlayer: true,
                x : utilities.withGrid(30),
                y : utilities.withGrid(10),
            },
        },

        cutsceneSpaces :{
            [utilities.gridCoord(29,9)] : [
                {
                    events: [
                        { 
                            type : "changeMap", 
                            map: "Kitchen",
                            x : utilities.withGrid(5),
                            y : utilities.withGrid(10),
                            direction: "up",
                    }
                    ]
                }
            ]
        }
    }
}