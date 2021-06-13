// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { CtxCamera } from "../ctx/ctx-camera";
import { Domain2, Graph, InputState, MultiLine, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";
import { GUID, NodesGraph } from "../elements/graph";
import { GeonNode } from "../elements/node";
import { Operation } from "../operations/operation";
import * as OPS from "../operations/functions";
import { Random } from "../../../engine/src/math/random";
import { NodesSidePanel } from "./nodes-ui";
import { Catalogue } from "../operations/ops-catalogue";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire body of nodes.
 * - Controls what happens with the nodes (creation / selection / deletion)
 * - Draws the nodes
 */
export class NodesController {
    
    private redrawAll = true;
    private _size = 30;
    get size() { return this._size; }

    // selection state 
    private selectedOperation: number = -1; // when placing new node
    private selectedNode: GUID = ""; // when selecting existing node

    private constructor(
        private readonly ctx: CTX,
        private readonly panel: NodesSidePanel,
        private readonly camera: CtxCamera,
        private readonly input: InputState,
        private readonly graph: NodesGraph,

        public catalogue: Catalogue,
        ) {}

    static new(htmlCanvas: HTMLCanvasElement, ui: HTMLDivElement) {

        const ctx = htmlCanvas.getContext('2d');
        if (!ctx || ctx == null) {
            alert("Canvas Rendering not supported in your browser. Try upgrading or switching!"); 
            return undefined;
        } 

        const camera = CtxCamera.new(ctx.canvas, Vector2.new(-100,-100), 1);
        const state = InputState.new(ctx.canvas);
        const graph = NodesGraph.new();

        
        let operations: Operation[] = OPS.defaultOperations.map(fn => Operation.new(fn));
        const catalogue = Catalogue.new(operations);
        const panel = NodesSidePanel.new(ui);

        return new NodesController(ctx, panel, camera, state, graph, catalogue);
    }

    start() {
        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        this.onResize();
        this.camera.onClick = this.onClick.bind(this);
        this.onClick(Vector2.zero());

        // hook up UI 
        this.panel.renderCatalogue(this.catalogue, (idx: number) => {
            this.selectOperation(idx);
        });

    }
    
    /**
     * NOTE: this is sort of the main loop of the whole node canvas
     * @param dt 
     */
    update(dt: number) {
        this.input.preUpdate(dt);
        let redraw = this.camera.update(this.input);

        if (redraw) {
            this.requestRedraw();
        }

        let cancelPresed =  (
            this.input.IsKeyPressed("Escape") ||
            this.input.IsKeyPressed(" ") ||
            this.input.IsKeyPressed("Backspace")
            );

        if (cancelPresed) {
            this.selectOperation();
            this.requestRedraw();
        }

        if (this.selectedOperation != -1) {
            this.requestRedraw();
        }

        this.input.postUpdate();
    }

    requestRedraw() {
        this.redrawAll = true;
    }

    draw() {
        
   
        // // draw cursor every frame, regardless
        // let g = this.toGrid(this.camera.mousePos);
        // let pos = this.toWorld(g);

   
        // // draw selection indicator if we have an existing node selected 


        // redraw everything if we moved the camera, for example
        if (!this.redrawAll) {
            return;
        }
        this.redrawAll = false;

        // prepare
        let ctx = this.ctx;
        let camera = this.camera;
        ctx.save();
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        camera.moveCtxToState(ctx);

        // draw grid 
        this.drawGrid(ctx);

        // draw nodes 
        for (let chip of this.graph.nodes.values()) {
            chip.draw(ctx, this);
        }

        // TODO draw cables 

        // draw node if we are placing a new node
        let g = this.toGrid(this.camera.mousePos);
        if (this.selectedOperation != -1) {
            let fakeNode = GeonNode.new(g, this.catalogue.ops[this.selectedOperation]);
            fakeNode.draw(ctx, this);
        }

        // done drawing
        ctx.restore();
    }

    drawGrid(ctx: CTX) {
 
        let cross = (x: number, y: number, s: number) => {
            ctx.moveTo(x, y-s);
            ctx.lineTo(x, y+s);
            ctx.moveTo(x-s, y);
            ctx.lineTo(x+s, y);
        }

        let box = this.camera.getBox();
        let size = this._size;
        let crosssize = size/4;
        let topleft = Vector2.new(box.x.t0, box.y.t0);
        let gridStart = this.toWorld(this.toGrid(topleft));

        ctx.save();
        ctx.fillStyle = '#111111';
        ctx.lineWidth = 0.11;
        
        for (let x = gridStart.x; x < box.x.t1; x += size) {
            for (let y = gridStart.y; y < box.y.t1; y += size) {
                // ctx.moveTo(x,y);
                ctx.beginPath();
                ctx.arc(x,y,1, 0, Math.PI*2);
                ctx.fill();
                // cross(x, y, crosssize);
            }
        }
        ctx.fill();
        ctx.restore();
    }

    // -----

    toGrid(wv: Vector2) {
        return Vector2.new(
            Math.round((wv.x - (this._size/2)) / this._size),
            Math.round((wv.y - (this._size/2)) / this._size)
        )
    }

    toWorld(gv: Vector2) {
        return gv.scaled(this._size);
    }

    // -----

    selectOperation(idx = -1) {
        this.selectedOperation = idx;
    }

    selectNode(guid = "") {
        this.selectedNode = guid;
    }

    // -----

    onClick(pos: Vector2) {

        // round to grid size
        let g = this.toGrid(pos);
        pos = this.toWorld(g);

        // spawn node with random operation
        // let rng = Random.fromRandom();
        // let count = this.catalogue.ops.length;
        // let value = Math.floor(rng.get() * count);
        if (this.selectedOperation != -1) {
            console.log("spawn!");
            let idx = this.selectedOperation;
            this.graph.addNode(GeonNode.new(g, this.catalogue.ops[idx]));
        }

        // this.graph.addNode(GeonNode.new(g, this.catalogue.ops[value]));


        this.requestRedraw();
    }

    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}