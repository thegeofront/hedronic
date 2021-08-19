// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { CtxCamera } from "../ctx/ctx-camera";
import { Domain2, Graph, InputState, MultiLine, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Random } from "../../../engine/src/math/random";
import { NodesSidePanel } from "./nodes-ui";
import { Catalogue, CoreType } from "../operations/catalogue";
import { drawCable, drawNode, DrawState } from "./nodes-rendering";
import { Socket, SocketSide } from "../graph/socket";
import { Widget } from "../graph/widget";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire body of nodes.
 * - Controls what happens with the nodes (creation / selection / deletion)
 * - Draws the nodes
 */
export class NodesCanvas {
    
    private redrawAll = true;
    private _size = 40;
    get size() { return this._size; }

    // selection state 
    private selectedSocket?: Socket;
    private hover?: Socket;
    private mgpStart? = Vector2.new(); // mouse grid point start of selection
    private mgpEnd? = Vector2.new(); // mouse grid point end of selection 
    private mgpHover = Vector2.new(); // mouse grid point hover

    private constructor(
        private readonly ctx: CTX,
        private readonly panel: NodesSidePanel,
        private readonly camera: CtxCamera,
        private readonly input: InputState,
        public graph: NodesGraph,

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

        const catalogue = Catalogue.newDefault();
        const panel = NodesSidePanel.new(ui);

        return new NodesCanvas(ctx, panel, camera, state, graph, catalogue);
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
        this.panel.renderCatalogue(this.catalogue, this.onSidePanelButtonPressed.bind(this));

        // DEBUG add a standard graph
        this.testGraph();
    }

    testGraph() {
        let INPUT = this.catalogue.widgets[0];
        let OUTPUT = this.catalogue.widgets[2];
        let AND = this.catalogue.operations[0];
        let OR = this.catalogue.operations[1];
        let NOT = this.catalogue.operations[2];

        this.graph = NodesGraph.new();
        
        // generate nodes
        let i1 = this.graph.addNode(GeonNode.newWidget(Vector2.new(5,0), INPUT.clone()));
        let i2 = this.graph.addNode(GeonNode.newWidget(Vector2.new(3,3), INPUT.clone()));

        let not = this.graph.addNode(GeonNode.new(Vector2.new(10,0), NOT));
        let or = this.graph.addNode(GeonNode.new(Vector2.new(10,2), OR));
        let and = this.graph.addNode(GeonNode.new(Vector2.new(15,0), AND));

        // let or2 = this.graph.addNode(GeonNode.new(Vector2.new(10,5), OR));
        // let and2 = this.graph.addNode(GeonNode.new(Vector2.new(10,8), AND));

        
        let o1 = this.graph.addNode(GeonNode.newWidget(Vector2.new(20,0), OUTPUT.clone()));
        // let o2 = this.graph.addNode(GeonNode.newWidget(Vector2.new(20,5), OUTPUT.clone()));
        // let o3 = this.graph.addNode(GeonNode.newWidget(Vector2.new(20,8), OUTPUT.clone()));

        // press a button 
        (this.graph.getNode(i1)?.core as Widget).state = true; 

        // generate cables
        this.graph.addCableBetween(i1, 0, not, 0);
        this.graph.addCableBetween(i1, 0, or, 0);
        this.graph.addCableBetween(i2, 0, or, 1);

        // this.graph.addCableBetween(i1, 0, or2, 0);
        // this.graph.addCableBetween(i2, 0, or2, 1);

        // this.graph.addCableBetween(i1, 0, and2, 0);
        // this.graph.addCableBetween(i2, 0, and2, 1);

        this.graph.addCableBetween(or, 0, and, 1);
        this.graph.addCableBetween(not, 0, and, 0);

        this.graph.addCableBetween(and, 0, o1, 0);
        // this.graph.addCableBetween(or2, 0, o2, 0);
        // this.graph.addCableBetween(and2, 0, o3, 0);

        this.graph.toJs();
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
            this.catalogue.deselect();
            this.selectSocket();
            this.requestRedraw();
        }

        if (this.input.IsKeyPressed("delete")) {
            if (this.selectedSocket) {
                this.graph.deleteNode(this.selectedSocket.node);
                this.selectedSocket = undefined;
                this.requestRedraw();
            }
        }

        if (this.input.IsKeyPressed("p")) {
            this.graph.log();
        }

        // refresh when placing new operation / node
        if (this.catalogue.selected) {
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
            if (this.selectedSocket && key == this.selectedSocket!.node) {
                drawNode(ctx, node, this, this.selectedSocket.idx, DrawState.OpSelected);
            } else if (this.hover && key == this.hover!.node) {
                drawNode(ctx, node, this, this.hover.idx, DrawState.OpHover);
            } else {
                drawNode(ctx, node, this, 0, DrawState.Op);
            }
        }

        // draw selection 


        // draw node if we are placing a new node
        let g = this.toGrid(this.camera.mousePos);
        if (this.catalogue.selected) {
            let fakeNode = this.catalogue.spawn(g)!;
            drawNode(ctx, fakeNode, this, 0, DrawState.OpPlacement);
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

    // ----- --------------------- -----
    // -----       Selection       -----
    // ----- --------------------- -----

    hoverSocket(s?: Socket) {
        this.hover = s;
    }

    selectSocket(s?: Socket) {
        this.selectedSocket = s;
    }
 
    deselectSocket() {
        this.selectedSocket = undefined;
    }

    trySelect(gridPos: Vector2) : Socket | undefined {
        for (let [key, value] of this.graph.nodes) {
            let res = value.trySelect(gridPos);
            if (res !== undefined) {
                return Socket.new(key, res);
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

    // ------ Events

    onMouseDown(gp: Vector2) {

        // console.log("down!");
        this.mgpStart = gp;
        this.mgpEnd = gp;
        
        if (this.catalogue.selected) {
            // we are placing a new node
            this.graph.addNode(this.catalogue.spawn(gp)!);
            if (!this.input.IsKeyDown("shift")) {
                this.catalogue.deselect();
            }
        } else {
            // we clicked at some spot. try to select something 
            let socket = this.trySelect(gp);
            this.selectSocket(socket);
            if (socket?.side == SocketSide.Widget) {
                // we just clicked a widget! let the widget figure out what to do
                (this.graph.getNode(socket.node)?.core as Widget).onClick(this);
            } 
        } 

        this.requestRedraw();
        // this.graph.addNode(GeonNode.new(g, this.catalogue.ops[value]));
        
    }

    onMouseUp(gp: Vector2) {
        // console.log("up!");

        // possibly create a line
        // see if the line drawn is indeed from input to output, or vise versa
        if (this.selectedSocket && this.hover) {
            if ((this.selectedSocket.side == SocketSide.Input && this.hover.side == SocketSide.Output) || 
            (this.selectedSocket.side == SocketSide.Output && this.hover.side == SocketSide.Input)) {
            
                console.log("adding cable...")
                this.graph.addCable(this.selectedSocket, this.hover);
                this.selectSocket();
                this.requestRedraw();
            }
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
        this.hoverSocket(this.trySelect(gp));
        this.requestRedraw();

        // if mouse is down and we are selecting a node 
        if (this.mgpStart && this.selectedSocket) {
            if (this.selectedSocket.side == SocketSide.Body) {
                // dragging node
                let node = this.graph.nodes.get(this.selectedSocket.node);
                node?.position.add(gp.subbed(this.mgpEnd!))
            } else {
                // dragging line
                // console.log("drag line");
            }
        }

        // update at end, so we can use mgpEnd as a delta for dragging
        this.mgpHover = gp;
        this.mgpEnd = gp;
    }

        
    onSidePanelButtonPressed(idx: number, type: CoreType) {

        this.catalogue.select(idx, type);
        this.selectSocket();
        // we must focus on the canvas after interacting with the html UI.
        // NOTE: this is another reason why we might want to hack HTML instead of this ctx canvas approach...
        this.input.canvas.focus();
    }


    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}