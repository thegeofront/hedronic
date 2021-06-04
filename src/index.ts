// purpose: entry point

import { NodesCanvas } from "./nodes/nodes-canvas";

function main() {
    // get references of all items on the canvas
    const html_canvas = document.getElementById("nodes-canvas")! as HTMLCanvasElement;
    const ui = document.getElementById("interface") as HTMLDivElement;
    
    const canvas = NodesCanvas.new(html_canvas, ui)!;

    function loop() {
        canvas.update();
        canvas.draw();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}


window.addEventListener("load", function () {main();}, false);