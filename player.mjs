import { Vector2, GameObject } from "./essentials.mjs";

function Player(_speed, renderer) {
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

    let sensitivity = 0.5;
    let sprinting = 0;

    let timeout_mouse = null;
    let _deelllttaaaaaaaa_MUAHAHAHAHAHA = 1;

    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);
    document.addEventListener("mousemove", (event) => {
        clearTimeout(timeout_mouse);
        rotation = event.movementX;
        timeout_mouse = setTimeout(() => { rotation = 0; }, _deelllttaaaaaaaa_MUAHAHAHAHAHA * 1000);
    });

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
        rotation *= 6 * Math.PI;
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

        if (document.pointerLockElement !== renderer) {
            return;
        }

        _deelllttaaaaaaaa_MUAHAHAHAHAHA = delta;

        // Changes in x and y axis
        const _delta = new Vector2(Math.cos(gameobject.theta_radians) * verticalAxis
            + Math.cos(gameobject.theta_radians + Math.PI / 2) * horizontalAxis,
            Math.sin(gameobject.theta_radians) * verticalAxis
            + Math.sin(gameobject.theta_radians + Math.PI / 2) * horizontalAxis);
        _delta.normalize(); // Make sure the player can't move faster diagonally
        _delta.multiplyScalar(speed * delta); // Set speed magnitude
        
        gameobject.position.add(new Vector2(_delta.x, 0));
        if (hierarchy.inCollider(gameobject.position, ["raycast"])) { // If moving on x axis moves to an occupied space, undo movement
            gameobject.position.add(new Vector2(-_delta.x, 0));
        }
        
        gameobject.position.add(new Vector2(0, _delta.y));
        if (hierarchy.inCollider(gameobject.position, ["raycast"])) { // If moving on y axis moves to an occupied space, undo movement
            gameobject.position.add(new Vector2(0, -_delta.y));
        }

        // Rotate player accordingly
        
        gameobject.theta_radians += rotation * sensitivity * 0.1 * delta;
    };

    return gameobject;
}

export {
    Player
}