import { Menu } from "../../menu/menu";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { UpdateMenuEvent, UpdatePluginsEvent } from "../registry";
import { HTML, Template } from "../util";
import { WebComponent } from "../web-component";


customElements.define('my-nodes-canvas', 
class MyNodesCanvas extends WebComponent {
    
    static readonly template = Template.html` 
    <style>
    #nodes-canvas {
        outline: none;
        /* background-color: var(--background); */
        /* opacity: 0; */
        /* background-color: rgba(0, 0, 0, .15);   */
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        display: block;
        width: 100%;
        height: var(--main-height);
    }

    /*

    #nodes-panel {
        position: absolute;
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
    
    */
    
    </style>
    <canvas id="nodes-canvas" tabindex="0">
    </canvas>
    `;
     
    nodes?: NodesCanvas

    constructor() {
        super();
    }  
    
    connectedCallback() {
        this.addFrom(MyNodesCanvas.template);
        this.init();
    }  

    async init() {
        // this.listen(CanvasResizeEvent, this.resizeCanvas);
        window.addEventListener("resize", this.resizeCanvas.bind(this));
        let canvas = this.get("nodes-canvas");

        // document.addEventListener("cut", this.onDomCut.bind(this));
        // document.addEventListener("copy", this.onDomCopy.bind(this));
        // document.addEventListener("paste", this.onDomPaste.bind(this));

        this.resizeCanvas();
        this.setupGraphEditor();
    }

    async setupGraphEditor() {

        // get references of all items on the canvas
        const html_canvas = this.get("nodes-canvas") as HTMLCanvasElement;
        // const ui = this.get("nodes-panel") as HTMLDivElement;
        // nodes
        this.nodes = (await NodesCanvas.new(html_canvas))!;
                
        // we are already building spagetti code, so lets go one step further
        window.nodes = this.nodes;

        console.log({"nodes": this.nodes})

        // menu 
        const menu = Menu.new(this.nodes);
        HTML.dispatch(UpdateMenuEvent, menu);
        HTML.dispatch(UpdatePluginsEvent);
        menu.bindEventListeners(html_canvas);

        // timing
        let acc_time = 0;
        // let counter = FpsCounter.new();

        // loop
        let loop = (elapsed_time: number) => {
            let delta_time = elapsed_time - acc_time;
            acc_time = elapsed_time;

            // counter._update(delta_time);
            // document.title = "fps: " + counter.getFps();

            this.nodes!.update(delta_time);
            this.nodes!.draw();
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

    onDomCut(e: ClipboardEvent) {
        console.log("dom cut on ", e.target);
        // e.clipboardData!.setData("text/plain", this.nodes.onCut());
        // e.preventDefault();
    }

    onDomCopy(e: ClipboardEvent) {
        console.log("dom copy")
        // e.clipboardData!.setData("text/plain", this.nodes.onCopy());
        // e.preventDefault();
    }

    onDomPaste(e: ClipboardEvent) {
        console.log("dom paste")
        // if (!e.clipboardData) {
        //     // alert("I would like a string, please");
        //     return;
        // }
        // if (e.clipboardData.items.length != 1) {
        //     // alert("I would like just one string, please");
        //     return;
        // }
        // e.clipboardData.items[0].getAsString((pastedString: string) => {
        //     this.nodes.onPaste(pastedString);
        // });
    }
});

declare global {
    interface Window {
        nodes: NodesCanvas
    }
}