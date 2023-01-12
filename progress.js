//Records which map the player is in, its current coords, and the savefile
//Allows for saving and loading files

class Progress {
    constructor() {
        this.mapId = "MainMap";
        this.startingMainX = 0;
        this.startingMainY = 0;
        this.startingMainDirection = "down";
        this.saveFileKey = "Portfolio_SaveFile";
    }

    save() {
        window.localStorage.setItem(this.saveFileKey, JSON.stringify({
            mapId : this.mapId,
            startingMainX: this.startingMainX,
            startingMainY: this.startingMainY,
            startingMainDirection : this.startingMainDirection,
            playerState : {
                storyFlags: playerState.storyFlags
            }
        }));
        console.log("State saved");
    }

    //Retrieves the save file, but if there is no save file, return null
    getSaveFile() {
        const file = window.localStorage.getItem(this.saveFileKey);
        return file ? JSON.parse(file) : null;
    }

    load() {
        const file = this.getSaveFile();
        if (file) {
            this.mapId = file.mapId;
            this.startingMainX = file.startingMainX;
            this.startingMainY = file.startingMainY;
            this.startingMainDirection = file.startingMainDirection;
            Object.keys(file.playerState).forEach(key => {
                playerState[key] = file.playerState[key];
            })
        }
        console.log("load saved state");
    }
}