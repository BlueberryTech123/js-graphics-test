import { Vector2, GameObject } from "./essentials.mjs";

function Map(path, _cell_size = 2) {
    let gameobject = new GameObject();

    let map = null;
    let map_width = 0;
    let map_height = 0;
    let map_loaded = false;
    const cell_size = _cell_size;

    function loadMap() {
        fetch(path).then((response) => {
            return response.text();
        }).then((raw_text) => {
            map = raw_text.split("\n"); // Translate raw text onto an array (map)
            map_width = map[0].length;
            map_height = map.length;

            map_loaded = true;
        });
    }

    function mapCellAt(x, y) {
        if (!map_loaded) {
            throw new Error('Map has not been loaded yet, make sure map_loaded is true');
        }
        return map[Math.floor(y)][Math.floor(x)];
    }
    function inBounds(position) {
        return position.x >= 0 && position.y >= 0 && position.x < map_width && position.y < map_height;
    }
    function snappedTile(position) {
        let snapped = position.snapped(cell_size);
        snapped.divideScalar(cell_size);

        return snapped;
    }
    gameobject.inCollider = (position) => {
        if (!map_loaded) {
            throw new Error('Map has not been loaded yet, make sure map_loaded is true');
        }

        const snapped = snappedTile(position);

        // If in bounds, return whether it is in cell normally, otherwise return true
        // Basically check if there is a tile in the current snapped position

        if (!inBounds(snapped)) {
            return true;
        }

        switch (mapCellAt(snapped.x, snapped.y)) {
            case "0": // Square
                return true;
            case "1": // Circle
                snapped.multiplyScalar(cell_size);
                snapped.add(new Vector2(cell_size / 2, cell_size / 2));
                const distance = Math.sqrt((snapped.x - position.x) ** 2 + (snapped.y - position.y) ** 2);
                return distance <= cell_size / 2;
            default:
                return false;
        }
    }
    
    loadMap();

    Object.assign(gameobject, {
        mapCellAt, snappedTile,
        // get map_width() { return map_width; },
        // get map_height() { return map_height; },
        // get map_loaded() { return map_loaded; },
        cell_size
    });

    Object.defineProperty(gameobject, "map", {
        get() { return map; }
    });
    Object.defineProperty(gameobject, "map_width", {
        get() { return map_width; }
    });
    Object.defineProperty(gameobject, "map_height", {
        get() { return map_height; }
    });
    Object.defineProperty(gameobject, "map_loaded", {
        get() { return map_loaded; }
    });

    return gameobject;
}

export {
    Map
}