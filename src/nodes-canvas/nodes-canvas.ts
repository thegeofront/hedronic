// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { CtxCamera } from "../ctx/ctx-camera";
import { Domain2, Graph, InputState, MultiLine, MultiVector2, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Random } from "../../../engine/src/math/random";
import { NodesSidePanel } from "./nodes-ui";
import { Catalogue, CoreType } from "../operations/catalogue";
import { drawCable, drawCableBetween, drawNode, DrawState } from "./nodes-rendering";
import { Socket, SocketSide } from "../graph/socket";
import { Widget } from "../graph/widget";
import { graphToFunction, makeOperationsGlobal } from "../graph/graph-conversion";
import { Operation } from "../graph/operation";
import { Cable, CableState } from "../graph/cable";
import { IO } from "../util/io";
import { NodesModule } from "../operations/module";
import { Menu } from "../ui/menu";
import { dom } from "../util/dom-writer";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire canvas of nodes.
 * - Controls what happens with the nodes (creation / selection / deletion)
 * - Draws the nodes
 */
export class NodesCanvas {
    
    private redrawAll = true;
    private _size = 35;
    get size() { return this._size; }

    // selection state 
    private selectedSockets: Socket[] = [];
    private hoverSocket?: Socket;
    private mgpStart? = Vector2.new(); // mouse grid point start of selection
    private mgpEnd? = Vector2.new(); // mouse grid point end of selection 
    private mgpHover = Vector2.new(); // mouse grid point hover

    // used to box select
    private boxStart: Vector2 | undefined;

    private constructor(
        private readonly ctx: CTX,
        private readonly panel: NodesSidePanel,
        private readonly camera: CtxCamera,
        private readonly input: InputState,
        public graph: NodesGraph,
        public menu: Menu,
        
        public catalogue: Catalogue,
        public stdPath: string,
        ) {}

    static new(htmlCanvas: HTMLCanvasElement, ui: HTMLDivElement, stdPath: string) {

        const ctx = htmlCanvas.getContext('2d');
        if (!ctx || ctx == null) {
            alert("Canvas Rendering not supported in your browser. Try upgrading or switching!"); 
            return undefined;
        } 

        const camera = CtxCamera.new(ctx.canvas, Vector2.new(-100,-100), 1);
        const state = InputState.new(ctx.canvas);
        const graph = NodesGraph.new();

        const catalogue = Catalogue.newFromStd();
        const panel = NodesSidePanel.new(ui);
        const menu = Menu.new(ui, catalogue, htmlCanvas);

        return new NodesCanvas(ctx, panel, camera, state, graph, menu, catalogue, stdPath);
    }

    async start() {

        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        this.onResize();
        this.camera.onMouseDown = (worldPos: Vector2) => {
            this.onMouseDown(this.toGrid(worldPos));
        }
        this.camera.onMouseUp = (worldPos: Vector2) => {
            this.onMouseUp(this.toGrid(worldPos));
        }

        this.setupLoadSave();
        this.setupCopyPaste();

        // DEBUG add a standard graph
        await this.loadModules(this.stdPath);
        this.testGraph();

        // publish catalogue and ui 
        this.ui();
    }

    setupLoadSave() {
        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
              e.preventDefault();

              let text = this.onCopy();
              IO.promptDownload("save.js", text);
            }
          }, false);
    }

    setupCopyPaste() {
        document.addEventListener("copy", (event) => {
            console.log("copy | save");
            event.clipboardData!.setData("text/plain", this.onCopy());
            event.preventDefault();
        })

        document.addEventListener("paste", (event) => {
            console.log("paste | load");

            console.log(event);

            if (!event.clipboardData) {
                // alert("I would like a string, please");
                return;
            }
            if (event.clipboardData.items.length != 1) {
                // alert("I would like just one string, please");
                return;
            }

            event.clipboardData.items[0].getAsString(this.onPaste.bind(this));
        });
    }

    onCopy() : string {
        return this.graph.toJs("GRAPH").toString();
    }

    onPaste(js: string) {
        let graph = NodesGraph.fromJs(js, this.catalogue)!;
        this.graph = graph;
        this.requestRedraw();
        this.graph.calculate();
    }

    async loadModules(stdPath: string) {

        // TODO move this to Catalogue, its catalogue's responsibility to manage modules
        let json = await IO.fetchJson(stdPath);
        for (let config of json.std) {
            let lib = await IO.importLibrary(config.path);
            let mod = NodesModule.fromJsObject(config.name, config.icon, config.fullPath, config.path, lib, this.catalogue);
            this.catalogue.addModule(mod);
        }
        this.ui();
        this.menu.updateCategories(this.catalogue);
    }

    async testGraph() {
        let js = `
        function anonymous(a /* "widget": "button" | "state": "true" | "x": 4 | "y": -1 */,c /* "widget": "button" | "state": "false" | "x": 4 | "y": 1 */
        ) {
            let [b] = bool.NOT(a) /* "x": 8 | "y": 0 */;
            let [d] = bool.OR(a, c) /* "x": 8 | "y": 1 */;
            let [e] = bool.AND(b, d) /* "x": 11 | "y": 0 */;
            return [e /* "widget": "lamp" | "x": 14 | "y": -1 */];
        }
        `;

        let graph = NodesGraph.fromJs(js, this.catalogue)!;
        this.graph = graph;
        this.requestRedraw();
        this.graph.calculate();
        return;
    }

    // TODO make this nicer...
    collapseCounter = 1;
    collapseGraphToOperation() {
        let GRAPH = this.graph.toJs("GRAPH" + this.collapseCounter);
        this.collapseCounter += 1;
        
        // @ts-ignore;
        let graph = Operation.new(GRAPH);
        if (this.catalogue.modules.has("graphs")) {
            this.catalogue.modules.get("graphs")!.operations.push(graph);
        } else {
            this.catalogue.addModule(NodesModule.new("graphs", "braces", "", [graph], [], this.catalogue));
        }
        this.ui();
    }

    ui() {
        
        // hook up UI 
        this.menu.updateCategories(this.catalogue);
        this.menu.renderNav();
        makeOperationsGlobal(this.catalogue);
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
            this.deselect();
            this.requestRedraw();
        }

        if (this.input.IsKeyPressed("delete")) {
            if (this.selectedSockets.length > 0) {
                for (let socket of this.selectedSockets) {
                    this.graph.deleteNode(socket.node);
                    this.requestRedraw();
                }
                this.deselect();
            }
        }

        if (this.input.IsKeyPressed(" ")) {
            this.collapseGraphToOperation(); 
        }

        if (this.input.IsKeyPressed("p")) {
            this.graph.log();
        }

        // refresh when placing new operation / node
        if (this.catalogue.selected) {

            // this.requestRedraw();
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
        let g = this.toGrid(this.camera.mousePos);

        // draw grid 
        this.drawGrid(ctx);

        // draw cables 
        for (let [key, cable] of this.graph.cables) {
            drawCable(ctx, cable, this);
        }

        // draw a cable if we are dragging a new cable
        if (this.mgpStart) {
            for (let socket of this.selectedSockets) {
                let fromNode = this.graph.nodes.get(socket.node)!;
                let p = fromNode.getConnectorGridPosition(socket.idx)!;
    
                if (socket.side == SocketSide.Input) {
                    drawCableBetween(ctx, g, p, this, CableState.Selected);
                } else if (socket.side == SocketSide.Output) {
                    drawCableBetween(ctx, p, g, this, CableState.Selected);
                }
            }
        }

        // draw nodes 
        for (let [key, node] of this.graph.nodes) {
            
            // TODO: fix the fact we cannot hover the node of the socket we are selecting...
            let selectedSocket = this.tryGetSelectedSocket(key);
            if (selectedSocket) {
                drawNode(ctx, node, this, selectedSocket.idx, DrawState.OpSelected);
            } else if (this.hoverSocket && key == this.hoverSocket!.node) {
                drawNode(ctx, node, this, this.hoverSocket.idx, DrawState.OpHover);
            } else {
                drawNode(ctx, node, this, 0, DrawState.Op);
            }
        }

        // draw selection box
        if (this.boxStart) {
            let a = this.toWorld(this.boxStart);
            let b = this.toWorld(this.mgpHover);
            ctx.fillStyle = "#ffffff44"
            ctx.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
        }

        // draw node if we are placing a new node
        if (this.catalogue.selected) {
            let fakeNode = this.catalogue.spawn(g)!;
            drawNode(ctx, fakeNode, this, 0, DrawState.OpPlacement);
        } else {

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

    hover(s?: Socket) {
        this.hoverSocket = s;
    }

    dehover() {
        this.hoverSocket = undefined;
    }

    select(s: Socket) {
        if (!this.tryGetSelectedSocket(s.node)) {
            this.selectedSockets.push(s);
        }
    }
 
    deselect() {
        this.selectedSockets = [];
    }

    tryGetSelectedSocket(key: string) : Socket | undefined {
        for (let socket of this.selectedSockets) {
            if (socket.node == key) {
                return socket;
            }
        }
        return undefined;
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

    startBox(gp: Vector2) {
        this.boxStart = gp.clone();
    }

    stopBox() {
        if (!this.boxStart!) {
            return;
        }

        // if a node falls in the box space, select it
        let a = this.boxStart;
        let b = this.mgpHover;
        let box = Domain2.fromBounds(a.x, b.x, a.y, b.y);
        for (let [key, node] of this.graph.nodes) {
            
            if (box.includesEx(node.position)) {
                this.select(Socket.new(key, 0));
            }
        }
        // reset the box
        this.boxStart = undefined;
    }

    // ------ Events

    onMouseDown(gp: Vector2) {

        // console.log("down!");
        this.mgpStart = gp;
        this.mgpEnd = gp;
        
        if (this.catalogue.selected) {
            // we are placing a new node
            this.graph.addNode(this.catalogue.spawn(gp)!);
            if (!this.input.IsKeyDown("control")) {
                this.catalogue.deselect();
            }
        } else {
            // we clicked at some spot. try to select something 
            let socket = this.trySelect(gp);
            if (!socket) {
                // we clicked an empty spot: deselect and draw a box
                this.deselect();
                this.startBox(gp);
                return;
            } else {
                // we clicked on a socket! 
                if (this.tryGetSelectedSocket(socket.node)) {
                    // do nothing if we click on a node we already have selected. This is needed for click and dragging multiple nodes
                } else if (!this.input.IsKeyDown("shift")) {
                    this.deselect();
                }

                this.select(socket);
                if (socket?.side == SocketSide.Widget) {
                    // we just clicked a widget! let the widget figure out what to do
                    (this.graph.getNode(socket.node)?.core as Widget).onClick(this);
                } 
            }
        } 

        this.requestRedraw();
    }

    onMouseUp(gp: Vector2) {
        // console.log("up!");

        // possibly create a line
        // see if the line drawn is indeed from input to output, or vise versa
        if (this.selectedSockets.length == 1 && this.hoverSocket) {
            let selectedSocket = this.selectedSockets[0];
            if ((selectedSocket.side == SocketSide.Input && this.hoverSocket.side == SocketSide.Output) || 
            (selectedSocket.side == SocketSide.Output && this.hoverSocket.side == SocketSide.Input)) {
            
                console.log("adding cable...")
                this.graph.addCable(selectedSocket, this.hoverSocket);
                this.deselect();
                this.requestRedraw();
                // new line means recalculation
                this.graph.calculate();
            }
        }

        // reset
        this.stopBox();
        this.mgpStart = undefined;
        this.mgpEnd = undefined;
        this.requestRedraw();
    }

    /**
     * fires when the mouse moves over to a new gridcell
     */
    onMouseGridMove(gp: Vector2) {

        // console.log("move!");

        // hovering
        this.hover(this.trySelect(gp));
        this.requestRedraw();

        // if mouse is down and we are selecting a node 
        if (this.mgpStart && this.selectedSockets.length > 0) {
            let delta = gp.subbed(this.mgpEnd!);
            for (let socket of this.selectedSockets) {
                if (socket.side == SocketSide.Body) {
                    // dragging node
                    let node = this.graph.nodes.get(socket.node);
                    node?.position.add(delta);
                } else {
                    // dragging line
                    // console.log("drag line");
                }
            }
        }

        // update at end, so we can use mgpEnd as a delta for dragging
        this.mgpHover = gp;
        this.mgpEnd = gp;
    }

        
    onSidePanelButtonPressed(idx: number, type: CoreType) {

        // THIS NEEDS TO BE HOOKED UP AGAIN
        // this.catalogue.select(idx, type);
        this.deselect();
        // we must focus on the canvas after interacting with the html UI.
        // NOTE: this is another reason why we might want to hack HTML instead of this ctx canvas approach...
        this.input.canvas.focus();
    }


    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}
