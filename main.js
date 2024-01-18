import { Vector2, GameObject, Hierarchy } from "./essentials.mjs";
import { Player } from "./player.mjs";
import { Map } from "./map.mjs";

function Scene() {
    const max_framerate = 60.0;
    const framerate_delta = 1.0 / max_framerate;

    let renderer = null;
    let ctx = null;
    let old_time = 0;

    // Map data
    let map = new Map("test_level.rcl");
    
    // Debug information
    let fps_display = document.querySelector("#fps");
    const minimap_x = 130;
    const minimap_y = 10;
    const minimap_scale = 1.25;
    const player_size = 1;

    // Hierarchy
    let maps_set = false;

    let hierarchy = null;
    let player = null;

    function updateSize() {
        renderer.width = window.innerWidth;
        renderer.height = window.innerHeight;
    }
    function initCanvas() {
        renderer = document.createElement("canvas");
        document.body.appendChild(renderer);

        ctx = renderer.getContext("2d");
        updateSize();
    }

    // =======================================================

    function displayMinimap() {
        for (let x = 0; x < map.map_width; x++) {
            for (let y = 0; y < map.map_height; y++) {
                const cell = map.mapCellAt(x, y);

                ctx.fillStyle = "rgb(240, 240, 240)";
                if (cell == ".") {
                    ctx.fillStyle = "rgb(30, 30, 30)";
                }

                ctx.fillRect(minimap_x + map.cell_size * x * minimap_scale, minimap_y + map.cell_size * y * minimap_scale,
                    map.cell_size * minimap_scale, map.cell_size * minimap_scale);
            }
        }

        // Display current tile
        // const snapped = map.snappedTile(player.position);
        // ctx.fillStyle = "rgb(45, 45, 45)";
        // ctx.fillRect(minimap_x + map.cell_size * snapped.x * minimap_scale, minimap_y + map.cell_size * snapped.y * minimap_scale, 
        //     map.cell_size * minimap_scale, map.cell_size * minimap_scale);

        // Display player
        const player_minimap_x = minimap_x + player.position.x * minimap_scale;
        const player_minimap_y = minimap_y + player.position.y * minimap_scale;

        ctx.fillStyle = ctx.strokeStyle = "rgb(0, 100, 240)";
        ctx.fillRect(player_minimap_x - player_size / 2 * minimap_scale, player_minimap_y - player_size / 2 * minimap_scale, 
            player_size * minimap_scale, player_size * minimap_scale);
        ctx.beginPath();
        ctx.moveTo(player_minimap_x, player_minimap_y);
        ctx.lineTo(player_minimap_x + Math.cos(player.theta_radians) * 4 * minimap_scale, player_minimap_y + Math.sin(player.theta_radians) * 4 * minimap_scale);
        ctx.stroke();
    }

    // =======================================================

    // Run at start
    function ready() {
        initCanvas();
        old_time = Date.now(); // For calculating delta time

        // Load player
        hierarchy = new Hierarchy(renderer, ctx);
        player = new Player(6.5, renderer);
        hierarchy.add(player, "player", true);

        // Add lock events
        renderer.addEventListener("click", async () => {
            await renderer.requestPointerLock();
        });
    }

    // Run every frame
    function update() {
        updateSize();
        if (!map.map_loaded) { // Don't render if map hasn't been loaded yet
            console.log(JSON.stringify(map));
            return;
        }
        else if (!maps_set) {
            player.map = map;
            hierarchy.add(map, "raycast");
            maps_set = true;
        }

        // Calculate delta
        const new_time = Date.now();
        const delta = (new_time - old_time) / 1000;
        old_time = new_time;

        // Update other objects
        hierarchy.update(delta);
        // displayMinimap();

        // Render debug information
        fps_display.innerHTML = `${Math.round(1 / delta)} FPS<br>Delta: ${delta}`;
    }

    // =======================================================

    ready();
    setInterval(update, framerate_delta);

    return {
        renderer: renderer
    }
}
let main = null;

$(document).ready(() => {
    main = new Scene();
});
$(document).bind("error", (event) => {
    alert(event);
})