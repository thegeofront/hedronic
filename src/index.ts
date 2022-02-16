// purpose: entry point
import { FpsCounter } from "../../engine/src/lib";
import { NodesCanvas } from "./nodes-canvas/nodes-canvas";
import { IO } from "./nodes-canvas/util/io";

async function main() {

    // get references of all items on the canvas
    const html_canvas = document.getElementById("nodes-canvas")! as HTMLCanvasElement;
    const ui = document.getElementById("nodes-panel") as HTMLDivElement;
    const stdPath = "./std.json";

    // nodes
    const nodes = NodesCanvas.new(html_canvas, ui, stdPath)!;
    nodes.start();

    // timing
    let acc_time = 0;
    let counter = FpsCounter.new();

    // publish globally 
    // @ts-ignore
    this.nodes = nodes;

    // loop
    function loop(elapsed_time: number) {
        let delta_time = elapsed_time - acc_time;
        acc_time = elapsed_time;

        counter._update(delta_time);
        document.title = "fps: " + counter.getFps();

        nodes.update(delta_time);
        nodes.draw();
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}

window.addEventListener("load", main, false);