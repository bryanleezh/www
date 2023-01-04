const utilities = {
    withGrid(num) {
        return num * 16
    },
    gridCoord(x,y) {
        return `${x*16},${y*16}` //takes the coords and multiplies by 16 since the everything is drawn in 16x16 pixels
    },
    //this function returns the next coords that the player will move to after inputting the movement keys
    nextPosition(initialX, initialY, direction) {
        let x = initialX;
        let y = initialY;
        const size = 16;
        if (direction === "left") {
            x -= size;
        } else if ( direction === "right") {
            x += size;
        } else if ( direction === "up") {
            y -= size;
        } else if ( direction === "down" ) {
            y += size;
        }
        return {x,y};
    },
    oppositeDirection(direction) {
        if (direction==="left") {return "right"}
        if (direction==="right") {return "left"}
        if (direction==="up") {return "down"}
        return "up"
    },
    //creating custom events on the browser itself
    emitEvent(name, detail) {
        const event = new CustomEvent(name, { 
            detail
        });
        document.dispatchEvent(event);
    },
    
}