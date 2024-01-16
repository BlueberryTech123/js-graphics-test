import { Vector2, GameObject } from "./essentials.mjs";

function Player(_speed) {
    const speed = _speed;

    let gameobject = new GameObject();
    gameobject.position = new Vector2(4, 4);
    let locked = true;

    let horizontalAxisRaw = {left: 0, right: 0};
    let verticalAxisRaw = {up: 0, down: 0};
    let rotationRaw = {left: 0, right: 0};

    let horizontalAxis = 0;
    let verticalAxis = 0;
    let rotation = 0;

    let sensitivity = 0.6;
    let sprinting = 0;

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    // Input functions

    function onKeyDown(event) {
        if (!locked) return;
    
        let keyCode = event.key;
    
        if (keyCode == "w" || keyCode == "W" || keyCode == "ArrowUp") verticalAxisRaw.up = 1;
        if (keyCode == "s" || keyCode == "S" || keyCode == "ArrowDown") verticalAxisRaw.down = 1;
        if (keyCode == "a" || keyCode == "A" || keyCode == "ArrowLeft") horizontalAxisRaw.left = 1;
        if (keyCode == "d" || keyCode == "D" || keyCode == "ArrowRight") horizontalAxisRaw.right = 1;

        if (keyCode == "q" || keyCode == "Q") rotationRaw.left = 1;
        if (keyCode == "e" || keyCode == "E") rotationRaw.right = 1;
    
        if (keyCode == "Shift") sprinting = 1;

        rotation = rotationRaw.right - rotationRaw.left;
        updateAxis();
    }
    function onKeyUp(event) {
        if (!locked) {
            verticalAxisRaw.up = verticalAxisRaw.down = horizontalAxisRaw.left = horizontalAxisRaw.right = sprinting = 0;
            return;
        }
    
        let keyCode = event.key;
    
        if (keyCode == "w" || keyCode == "W" || keyCode == "ArrowUp") verticalAxisRaw.up = 0;
        if (keyCode == "s" || keyCode == "S" || keyCode == "ArrowDown") verticalAxisRaw.down = 0;
        if (keyCode == "a" || keyCode == "A" || keyCode == "ArrowLeft") horizontalAxisRaw.left = 0;
        if (keyCode == "d" || keyCode == "D" || keyCode == "ArrowRight") horizontalAxisRaw.right = 0;

        if (keyCode == "q" || keyCode == "Q") rotationRaw.left = 0;
        if (keyCode == "e" || keyCode == "E") rotationRaw.right = 0;
    
        if (keyCode == "Shift") sprinting = 0;

        rotation = rotationRaw.right - rotationRaw.left;
        updateAxis();
    }

    function updateAxis() {
        horizontalAxis = horizontalAxisRaw.right - horizontalAxisRaw.left;
        verticalAxis = verticalAxisRaw.up - verticalAxisRaw.down;
    }

    // =======================================================

    gameobject.theta_radians = 3 * Math.PI / 2;
    gameobject.update = (delta) => {
        const hierarchy = gameobject.hierarchy;
        if (!hierarchy) {
            return;
        }

        // Changes in x and y axis
        const delta_x = Math.cos(gameobject.theta_radians) * verticalAxis * speed * delta
            + Math.cos(gameobject.theta_radians + Math.PI / 2) * horizontalAxis * speed * delta;
        const delta_y = Math.sin(gameobject.theta_radians) * verticalAxis * speed * delta
            + Math.sin(gameobject.theta_radians + Math.PI / 2) * horizontalAxis * speed * delta;
        
        gameobject.position.add(new Vector2(delta_x, 0));
        if (hierarchy.inCollider(gameobject.position, ["raycast"])) { // If moving on x axis moves to an occupied space, undo movement
            gameobject.position.add(new Vector2(-delta_x, 0));
        }
        
        gameobject.position.add(new Vector2(0, delta_y));
        if (hierarchy.inCollider(gameobject.position, ["raycast"])) { // If moving on y axis moves to an occupied space, undo movement
            gameobject.position.add(new Vector2(0, -delta_y));
        }

        // Rotate player accordingly
        gameobject.theta_radians += rotation * Math.PI / 10 * delta;
    };

    return gameobject;
}

export {
    Player
}