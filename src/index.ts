// purpose: entry point
import { FpsCounter } from "../../engine/src/lib";
import { Catalogue } from "./module-loading/catalogue";
import { ModuleLoading } from "./module-loading/module-loading";
import { NodesCanvas } from "./nodes-canvas/nodes-canvas";

async function setupCatalogue() {
    const stdPath = "./std.json";
    const catalogue = ModuleLoading.loadModulesToCatalogue(stdPath);
    return catalogue;
}

async function setupGraphEditor(catalogue: Catalogue) {

    // get references of all items on the canvas
    const html_canvas = document.getElementById("nodes-canvas")! as HTMLCanvasElement;
    const ui = document.getElementById("nodes-panel") as HTMLDivElement;
    
    // nodes
    const nodes = NodesCanvas.new(html_canvas, ui, catalogue)!;
    nodes.start();

    // timing
    let acc_time = 0;
    let counter = FpsCounter.new();

    // publish globally 
    // @ts-ignore
    window.nodes = nodes;

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

async function main() {
    let catalogue = await setupCatalogue();
    setupGraphEditor(catalogue);
}

window.addEventListener("load", main, false);