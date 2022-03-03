import { visitNode } from "typescript";
import { Catalogue } from "../../modules/catalogue";
import { ModuleLoading } from "../../modules/loading";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { Template } from "../util";
import { WebComponent } from "../web-component";
import { CanvasResizeEvent } from "./my-main";

customElements.define('my-nodes-canvas', 
class MyNodesCanvas extends WebComponent {
    
    static readonly template = Template.html` 

    <!-- our own css -->
    <style>
    #nodes-canvas {
        outline: none;
        /* background-color: var(--background); */
        /* opacity: 0; */
        background-color: rgba(0, 0, 0, .15);  
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: block;
        width: 100%;
        height: calc(var(--main-height));
    }

    #nodes-panel {
        position: absolute;
        /* height: 100vh; */
        display: flex;
        align-items: center;
    }

    #nodes-panel button {
        background-color: var(--antracite-dark);
        border-color: var(--white);
        color: var(--white);
        min-width: 40px;
        min-height: 40px;
        border-radius: 5px;
    }

    #nodes-panel .create-gizmo-button-wrapper button {
        background-color: var(--white);
        border-color: var(--antracite-dark);
        color: var(--antracite-dark);
        min-width: 40px;
        min-height: 40px;
        border-radius: 5px;
    }
    </style>
    <canvas id="nodes-canvas" tabindex="0">
    </canvas>
    `;
        
    async connectedCallback() {
        this.addFrom(MyNodesCanvas.template);
        let catalogue = await this.setupCatalogue();
        this.setupGraphEditor(catalogue);
        
        // this.listen(CanvasResizeEvent, this.resizeCanvas);
        window.addEventListener("resize", this.resizeCanvas.bind(this));
        this.resizeCanvas();
        // this.addEventListener("resize", this.resizeCanvas.bind(this));
    }  

    async setupCatalogue() {
        const stdPath = "./std.json";
        const catalogue = ModuleLoading.loadModulesToCatalogue(stdPath);
        return catalogue;
    }

    async setupGraphEditor(catalogue: Catalogue) {

        // get references of all items on the canvas
        const html_canvas = this.get("nodes-canvas") as HTMLCanvasElement;
        const ui = this.get("nodes-panel") as HTMLDivElement;
        
        // nodes
        const nodes = NodesCanvas.new(html_canvas, ui, catalogue)!;
        nodes.start();

        // timing
        let acc_time = 0;
        // let counter = FpsCounter.new();

        // publish globally 
        // @ts-ignore
        window.nodes = nodes;

        // loop
        function loop(elapsed_time: number) {
            let delta_time = elapsed_time - acc_time;
            acc_time = elapsed_time;

            // counter._update(delta_time);
            // document.title = "fps: " + counter.getFps();

            nodes.update(delta_time);
            nodes.draw();
            requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
    }

    getCanvas() {
        
        return this.get("nodes-canvas") as HTMLCanvasElement;
    }

    resizeCanvas() {
        let canvas = this.getCanvas();
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // let {newWidth, newHeight} = payload;

        // canvas.width = newWidth;
        // canvas.height = newHeight;
    }
});