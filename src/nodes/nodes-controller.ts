// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { CtxCamera } from "../ctx/ctx-camera";
import { Domain2, Graph, InputState, MultiLine, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";
import { Comp, GUID, NodesGraph } from "../elements/graph";
import { GeonNode } from "../elements/node";
import { Operation } from "../operations/operation";
import { defaultOperations } from "../operations/functions";
import { Random } from "../../../engine/src/math/random";
import { NodesSidePanel } from "./nodes-ui";
import { Catalogue } from "../operations/ops-catalogue";
import { drawCable, drawNode, NodeState } from "./nodes-rendering";

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
    private selectedOp: number = -1; // when placing new node
    private selectedNode: GUID = ""; // when selecting existing node
    private selectedComp?: Comp; // part of the node that is selected
    private hoverNode: GUID = ""; // when selecting existing node
    private hoverComp?: Comp; // when selecting existing node
    private mgpStart? = Vector2.new(); // mouse grid point start of selection
    private mgpEnd? = Vector2.new(); // mouse grid point end of selection 
    private mgpHover = Vector2.new(); // mouse grid point hover

    private constructor(
        private readonly ctx: CTX,
        private readonly panel: NodesSidePanel,
        private readonly camera: CtxCamera,
        private readonly input: InputState,
        public readonly graph: NodesGraph,

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

        
        let operations: Operation[] = defaultOperations.map(fn => Operation.new(fn));
        const catalogue = Catalogue.new(operations);
        const panel = NodesSidePanel.new(ui);

        return new NodesController(ctx, panel, camera, state, graph, catalogue);
    }

    start() {
        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        this.onResize();
        this.camera.onMouseDown = (worldPos: Vector2) => {
            this.onMouseDown(this.toGrid(worldPos));
        }
        this.camera.onMouseUp = (worldPos: Vector2) => {
            this.onMouseUp(this.toGrid(worldPos));
        }


        // hook up UI 
        this.panel.renderCatalogue(this.catalogue, (idx: number) => {
            this.selectOperation(idx);
            this.selectNode();
            // we must focus on the canvas after interacting with the html UI.
            // NOTE: this is another reason why we might want to hack HTML instead of this ctx canvas approach...
            this.input.canvas.focus();
        });

        // DEBUG add a standard graph
        this.testGraph();
    }
    
    testGraph() {
        let NOT = this.catalogue.ops[2];
        let OR = this.catalogue.ops[1];
        let AND = this.catalogue.ops[0];
        
        let a = this.graph.addNode(GeonNode.new(Vector2.new(0,0), NOT));
        let b = this.graph.addNode(GeonNode.new(Vector2.new(0,2), OR));
        let c = this.graph.addNode(GeonNode.new(Vector2.new(5,0), AND));
        this.graph.addCableBetween(a, 1, c, -1);

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

        // mouse
        this.updateMouse(this.camera.mousePos);
        
        // keys
        let cancelPresed =  (
            this.input.IsKeyPressed("escape") ||
            this.input.IsKeyPressed(" ") ||
            this.input.IsKeyPressed("backspace")
            );

        if (cancelPresed) {
            this.selectOperation();
            this.selectNode();
            this.requestRedraw();
        }

        if (this.input.IsKeyPressed("delete")) {
            if (this.selectedNode != "") {
                this.graph.deleteNode(this.selectedNode);
                this.selectedNode == "";
                this.requestRedraw();
            }
        }

        // refresh when placing new operation / node
        if (this.selectedOp != -1) {
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

        // draw cables 
        for (let [key, cable] of this.graph.cables) {
            drawCable(ctx, cable, this);
        }

        // draw nodes 
        for (let [key, node] of this.graph.nodes) {
            
            // TODO: fix the fact we cannot hover the node of the socket we are selecting...
            if (key == this.selectedNode) {
                drawNode(ctx, node, this, this.selectedComp!, NodeState.Selected);
            } else if (key == this.hoverNode) {
                drawNode(ctx, node, this, this.hoverComp!, NodeState.Hover);
            } else {
                drawNode(ctx, node, this, 0, NodeState.Normal);
            }
        }

        // draw selection 


        // draw node if we are placing a new node
        let g = this.toGrid(this.camera.mousePos);
        if (this.selectedOp != -1) {
            let fakeNode = GeonNode.new(g, this.catalogue.ops[this.selectedOp]);
            drawNode(ctx, fakeNode, this, 0, NodeState.Placement);
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
        let crosssize = size/20;
        let topleft = Vector2.new(box.x.t0, box.y.t0);
        let gridStart = this.toWorld(this.toGrid(topleft));

        ctx.save();
        ctx.fillStyle = '#111111';
        ctx.lineWidth = 0.5;
        ctx.beginPath();

        for (let x = gridStart.x; x < box.x.t1; x += size) {
            for (let y = gridStart.y; y < box.y.t1; y += size) {
                
                
                // ctx.fillRect(x,y,1,1);
                // ctx.arc(x,y,1, 0, Math.PI*2);
                /// ctx.fill();

                ctx.moveTo(x,y);
                cross(x, y, crosssize);
            }
        }

        ctx.stroke();
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

    // -----

    /**
     * empty to deselect
     */
    selectOperation(idx = -1) {
        this.selectedOp = idx;
    }

    /**
     * empty to deselect
     */
    selectNode(guid = "", comp?: number) {
        this.selectedNode = guid;
        this.selectedComp = comp;
    }

 
    trySelect(gridPos: Vector2) : [GUID, number] | undefined {
        for (let key of this.graph.nodes.keys()) {
            let res = this.graph.nodes.get(key)!.trySelect(gridPos);
            if (res !== undefined) {
                return [key, res];
            }
        }
        return undefined;
    }

    updateMouse(worldPos: Vector2) {

        let g = this.toGrid(worldPos);
        if (!g.equals(this.mgpHover)) {
            this.onMouseGridMove(g);
        }

    }

    onMouseDown(gp: Vector2) {

        // console.log("down!");
        this.mgpStart = gp;
        this.mgpEnd = gp;
        
        if (this.selectedOp != -1) {
            // we are placing a new node
            let idx = this.selectedOp;
            this.graph.addNode(GeonNode.new(gp, this.catalogue.ops[idx]));
            if (!this.input.IsKeyDown("shift")) {
                this.selectOperation();
            }
        } else {
            // we clicked at some spot
            let selection = this.trySelect(gp)
            if (selection !== undefined) {
                // console.log("selected!", selection);
                this.selectedNode = selection[0];
                this.selectedComp = selection[1];
            } else {
                this.selectedNode = "";
                this.selectedComp = undefined;
            }
        } 

        this.requestRedraw();
        // this.graph.addNode(GeonNode.new(g, this.catalogue.ops[value]));
        
    }

    onMouseUp(gp: Vector2) {
        // console.log("up!");

        // possibly create a line
        if (this.selectedNode != "" && this.hoverNode != "" &&
            (this.selectedComp! > 0 && this.hoverComp! < 0) || 
            (this.selectedComp! < 0 && this.hoverComp! > 0)
            ) {
            console.log("adding cable...")
            this.graph.addCableBetween(
                this.selectedNode, 
                this.selectedComp!, 
                this.hoverNode, 
                this.hoverComp!);
            this.selectNode();
            this.requestRedraw();
        }

        // reset
        this.mgpStart = undefined;
        this.mgpEnd = undefined;
    }

    /**
     * fires when the mouse moves over to a new gridcell
     */
    onMouseGridMove(gp: Vector2) {

        // console.log("move!");

        // hovering
        let selection = this.trySelect(gp)
        if (selection !== undefined) {
            this.hoverNode = selection[0];
            this.hoverComp = selection[1];
            this.requestRedraw();
        } else {
            this.hoverNode = "";
            this.hoverComp = undefined;
            this.requestRedraw();
        }

        // if mouse is down and we are selecting a node 
        if (this.mgpStart && this.selectedNode != "") {
            if (this.selectedComp == 0) {
                // dragging node
                let node = this.graph.nodes.get(this.selectedNode);
                node?.gridpos.add(gp.subbed(this.mgpEnd!))
            } else {
                // dragging line
                console.log("drag line");
            }
        }

        // update at end, so we can use mgpEnd as a delta for dragging
        this.mgpHover = gp;
        this.mgpEnd = gp;
    }

    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}