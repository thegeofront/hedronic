// purpose: entry point

import { NodesCanvas } from "./nodes/nodes-core";

function main() {
    // get references of all items on the canvas
    const html_canvas = document.getElementById("nodes-canvas")! as HTMLCanvasElement;
    const ui = document.getElementById("interface") as HTMLDivElement;
    
    const canvas = NodesCanvas.new(html_canvas, ui)!;
    canvas.start();

    let acc_time = 0;



    function loop(elapsed_time: number) {
        let delta_time = elapsed_time - acc_time;
        acc_time = elapsed_time;
        canvas.update(delta_time);
        canvas.draw();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}


window.addEventListener("load", function () {main();}, false);