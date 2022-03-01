import { Catalogue } from "../../modules/catalogue";
import { ModuleLoading } from "../../modules/loading";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-nodes-canvas', 
class MyNodesCanvas extends WebComponent {
    
    static readonly template = Template.html` 

    <!-- our own css -->
    <style>
    html {
        font-family: sans-serif;
        /* background-color: var(--antracite-light); */
        /* overflow: hidden; */
    }

    code {
        font-family: Consolas,"courier new";
        padding: 2px;
        font-size: 95%;
    }

    h1 {
        text-align: center;
        color: white;
        line-height: 100px;
        margin: 0;
    }

    article, footer {
        /* margin: 10px; */
        width:fit-content;
        height:fit-content;
        /* background: var(---background); */
    }

    #nodes-canvas {
        position: absolute;
        left: 0;
        top: 0;
        width: 500px;
        height: 500px;

        background-color: var(--background);
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
    <canvas id="canvas">
    </canvas>
    <article id="nodes">
        <canvas id="nodes-canvas" tabindex="0"></canvas>
        <div id="nodes-panel"></div>
        </canvas>
    </article>
    `;
        
    connectedCallback() {
        this.addFrom(MyNodesCanvas.template);
        this.initialize();
    }  

    async initialize() {
        let catalogue = await this.setupCatalogue();
        this.setupGraphEditor(catalogue);
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


});