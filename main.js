function Scene() {
    let renderer = null;
    let ctx = null;

    function initCanvas() {
        renderer = document.createElement("canvas");
        document.body.appendChild(renderer);

        ctx = renderer.getContext("2d");
        // renderer.width = window.innerWidth;
        // renderer.height = window.innerHeight;
    }

    // Ran on document load
    function ready() {
        initCanvas();
        ctx.fillStyle = "rgb(0, 255, 0)";
        ctx.fillRect(0, 0, width, height);
    }

    // Ran every frame
    function update() {
        //
    }

    ready();
    update();

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