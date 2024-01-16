import { Player } from "./player.mjs";

function Vector2(_x, _y) {
    let x = _x;
    let y = _y;

    function add(vector2) {
        x += vector2.x;
        y += vector2.y;
    }

    function multiplyScalar(v) {
        x *= v;
        y *= v;
    }

    function divideScalar(v) {
        x /= v;
        y /= v;
    }

    function snapped(cell_size) {
        return new Vector2(
            Math.floor(x / cell_size) * cell_size,
            Math.floor(y / cell_size) * cell_size
        );
    }

    return {
        get x() { return x; },
        get y() { return y; },
        add: add,
        multiplyScalar: multiplyScalar,
        divideScalar: divideScalar,
        snapped: snapped
    };
}

function GameObject(_position = null, _theta_radians = null) {
    let position = _position;
    let theta_radians = _theta_radians; // Angle from standard position in radians
    let hierarchy = null;

    if (!_position) position = new Vector2(0, 0);
    if (!theta_radians) theta_radians = 0;

    function ready() {
        // TODO: IMplement lol
    }

    function update(delta) {
        // TODO: Implement lol
    }

    function inCollider(position) {
        return false;
    }

    return {
        position: position,
        get theta_radians() { return theta_radians; },
        set theta_radians(v) { theta_radians = v; },
        get hierarchy() { return hierarchy; },
        set hierarchy(v) { hierarchy = v; },
        ready, update, inCollider
    };
}

function Hierarchy(renderer, ctx) {
    let tree = [];
    let layer_objects = {
        default: [],
        raycast: [],
        player: [],
        enemies: []
    };
    let layers = Object.keys(layer_objects);
    let player = null;

    function add(object, layer, is_player = false) {
        object.hierarchy = this;
        tree.push(object);
        layer_objects[layer].push(object);

        if (is_player) {
            player = object;
        }
    }

    function inCollider(position, layer_mask = null) { // Loop through all objects in layers & check for collisions
        if (!layer_mask) {
            layer_mask = Object.keys(layer_objects);
        }

        for (let i = 0; i < layer_mask.length; i++) {
            const cur_layer = layer_mask[i];
            const cur_layer_objects = layer_objects[cur_layer];

            for (let j = 0; j < cur_layer_objects.length; j++) {
                if (cur_layer_objects[j].inCollider(position)) {
                    return cur_layer_objects[j]; // Return hit object
                }
            }
        }
        return null; // If no collision, return absolutely nothing
    }

    function raycast(origin, normalized_direction, layer_mask, max_distance) {
        let position = new Vector2(origin.x, origin.y); // Clone vectors (so we don't accidentally modify the original)
        let increment = new Vector2(normalized_direction.x, normalized_direction.y); // Clone vectors (so we don't accidentally modify the original)
        increment.multiplyScalar(0.1);

        for (var i = 0; i <= max_distance; i += 0.1) { // Move "projectile" by increment until it hits something
            position.add(increment);
            const collision = inCollider(position, layer_mask);
            if (collision) {
                return {
                    gameobject: collision,
                    point: position,
                    distance: i
                }; // Return hit object
            }
        }
        return null; // If no intersection, return absolutely nothing
    }

    function update(delta) {
        for (let i = 0; i < tree.length; i++) {
            tree[i].update(delta);
        }

        // ==============================================================
        // Render map

        const rays = 256;
        const half_angle = Math.PI / 3.0;
        const angle_increment = 2.0 * half_angle / rays;
        const theta_start = player.theta_radians - half_angle;

        const render_distance = 70.0;
        const rect_size = renderer.width / rays;

        // const gradient = ctx.createLinearGradient(0, renderer.height / 2, 0, renderer.height);
        // gradient.addColorStop(0, "#000");
        // gradient.addColorStop(1, "#eee");
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0, renderer.height / 2, renderer.width, renderer.height / 2);

        // const gradient = ctx.createLinearGradient(0, 0, 0, renderer.height);
        // gradient.addColorStop(0, "#54503d");
        // gradient.addColorStop(0.5, "#000");
        // gradient.addColorStop(1, "#54503d");
        // ctx.fillStyle = gradient;
        // ctx.fillRect(0, 0, renderer.width, renderer.height);

        // const skybox_width = 1400 / 512 * renderer.height;
        // renderer.style.backgroundPosition = `-${(player.theta_radians / (2 * Math.PI) * skybox_width) % skybox_width}px 0px`;

        ctx.fillStyle = "#5c2e31";
        ctx.fillRect(0, renderer.height / 2, renderer.width, renderer.height / 2);

        for (let i = 0; i < rays; i++) {
            const theta_radians = theta_start + i * angle_increment;
            const _raycast = raycast(player.position, new Vector2(
                Math.cos(theta_radians), Math.sin(theta_radians)
            ), ["raycast"], render_distance);

            if (_raycast) { // If raycast hit something within render distance
                const local_theta = Math.abs(-half_angle + i * angle_increment);
                let actual_distance = _raycast.distance * Math.cos(local_theta);

                if (actual_distance == 0) actual_distance = 1;

                const height = renderer.height / actual_distance; // size / distance
                const fog_multiplier = _raycast.distance / render_distance;
                // console.log(_raycast.distance)
                // console.log(height);

                // 62, 31, 33

                ctx.fillStyle = "#30181a";
                ctx.fillRect(
                    rect_size * i - 1, renderer.height / 2 - height / 2 - 5,
                    rect_size + 1, height + 10);

                ctx.fillStyle = `rgb(
                    ${158 + fog_multiplier * (62 - 158)}, 
                    ${95 + fog_multiplier * (31 - 95)}, 
                    ${99 + fog_multiplier * (33 - 99)})`;
                ctx.fillRect(
                    rect_size * i - 1.5, renderer.height / 2 - height / 2,
                    rect_size + 3, height);
            }
        }
    }

    return {
        get tree() { return tree; },
        set tree(v) { tree = v; },
        get layer_objects() { return layer_objects; },
        get layers() { return layers; },
        add, inCollider, raycast, update
    };
}

export {
    Vector2, GameObject, Hierarchy
}