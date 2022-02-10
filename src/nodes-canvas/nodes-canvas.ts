// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { CtxCamera } from "../ctx/ctx-camera";
import { Domain2, Graph, InputState, MultiLine, MultiVector2, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Random } from "../../../engine/src/math/random";
import { Catalogue, CoreType } from "../operations/catalogue";
import { drawCable, drawCableBetween, drawNode, DrawState } from "./nodes-rendering";
import { Socket, SocketSide } from "../graph/socket";
import { Widget, WidgetSide } from "../graph/widget";
import { graphToFunction, makeOperationsGlobal } from "../graph/graph-conversion";
import { Operation } from "../graph/operation";
import { Cable, CableState } from "../graph/cable";
import { IO } from "../util/io";
import { NodesModule } from "../operations/module";
import { Menu } from "../ui/menu";
import { dom } from "../util/dom-writer";
import { GraphHistory as GraphHistory } from "../actions/graph-history";

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
        private readonly camera: CtxCamera,
        private readonly input: InputState,
        public graph: NodesGraph,
        public graphHistory: GraphHistory,
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
        const graphDecoupler = GraphHistory.new(graph);

        const catalogue = Catalogue.newFromStd();
        
        const menu = Menu.new(ui, htmlCanvas);

        return new NodesCanvas(ctx, camera, state, graph, graphDecoupler, menu, catalogue, stdPath);
    }


    async start() {

        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        this.ctx.canvas.addEventListener("blur", () => console.log("blur")); 
        this.ctx.canvas.addEventListener("focus", () => console.log("focus")); 
        this.ctx.canvas.addEventListener("mouseout", () => console.log("mouseout")); 
        this.onResize();
        this.camera.onMouseDown = (worldPos: Vector2) => {
            this.onMouseDown(this.toGrid(worldPos));
        }
        this.camera.onMouseUp = (worldPos: Vector2) => {
            this.onMouseUp(this.toGrid(worldPos));
        }

        this.setupControlKeyActions();

        // DEBUG add a standard graph
        await this.loadModules(this.stdPath);
        this.testGraph();

        // publish catalogue and ui 
        this.ui();
    }

    
    /**
     * This also defines wrapper functions to handle the Dom Events 
     * TODO: add an overview of all avaiable Ctrl + [abc] shortcuts, make this scalable, etc...
     */
    setupControlKeyActions() {

        document.addEventListener("keydown", (e) => {
            
            let control = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey);
            let shift = e.shiftKey;      
            var key = e.key.toLowerCase(); 

            if (control && key == 'a')
                this.onSelectAll();
            else if (control && key == 's')
                this.onSave();
            else if (control && key == 'l')
                this.onLoad();
            else if (control && key == 'z') 
                this.onUndo();
            else if (control && key == 'y') 
                this.onRedo();
            else if (control && key == ' ') 
                this.test();
            else    
                return;
            
            e.preventDefault();

        }, false);

        document.addEventListener("cut", (e) => {
            console.log("cutting...");
            e.clipboardData!.setData("text/plain", this.onCut());
            e.preventDefault();
        })

        // to special things with Ctrl + C and Ctrl + V, we need access to the clipboard using these specific events...
        document.addEventListener("copy", (e) => {
            console.log("copying...");
            e.clipboardData!.setData("text/plain", this.onCopy());
            e.preventDefault();
        })

        document.addEventListener("paste", (e) => {
            console.log("paste");
            if (!e.clipboardData) {
                // alert("I would like a string, please");
                return;
            }
            if (e.clipboardData.items.length != 1) {
                // alert("I would like just one string, please");
                return;
            }
            e.clipboardData.items[0].getAsString(this.onPaste.bind(this));
        });
    }


    test() {

    }


    onNew() {
        console.log("new...");
        this.reset();
    }


    reset(graph= NodesGraph.new()) {
        this.graph = graph;
        this.graphHistory.reset(graph);
        this.graph.calculate();
        this.requestRedraw();
    }


    onChange() {
        this.graph.calculate();
        this.requestRedraw();
    }

    // Ctrl + S
    onSave() {
        console.log("saving...");
        let text = this.onCopy();
        IO.promptSaveFile("graph.json", text);
    }


    // Ctrl + L
    onLoad() {
        console.log("loading...");
        IO.promptLoadTextFile((str) => {
            
            // TODO check if valid. etc. etc. 
            if (!str) {
                return;
            }
            this.reset(NodesGraph.fromSerializedJson(str.toString(), this.catalogue)!);
        })
    }


    onLoadJs() {
        console.log("loading from javascript...");
        IO.promptLoadTextFile((str) => {
            
            // TODO check if valid. etc. etc. 
            if (!str) {
                return;
            }
            this.reset(NodesGraph.fromJs(str.toString(), this.catalogue)!);
        })
    }

    
    onSaveJs() {
        console.log("saving as javascript...");
        let text = this.graph.toJs("graph").toString();
        IO.promptSaveFile("graph.js", text, "text/js");
    }


    // Ctrl + X
    onCut() : string {  
        let str = JSON.stringify(NodesGraph.toJson(this.graph), null, 2)
        return str; 
    }


    // Ctrl + C
    onCopy() : string {
        // let str = this.graph.toJs("GRAPH").toString();
        let str = JSON.stringify(NodesGraph.toJson(this.graph), null, 2)
        console.log(str);
        return str; 
    }


    // Ctrl + V
    onPaste(str: string, fromJs=false) {
        let newGraph;
        if (fromJs) {
            newGraph = NodesGraph.fromJs(str, this.catalogue)!;
        } else {
            newGraph = NodesGraph.fromSerializedJson(str, this.catalogue)!;
        }
        this.graph.addGraph(newGraph);

        // select all new nodes
        this.deselect();
        for (let [k, v] of newGraph.nodes) {
            v.position.add(Vector2.new(1, 1));
            this.select(Socket.new(k, 0));
        }

        this.graph.calculate();
        this.requestRedraw();
    }


    // Ctrl + A
    onSelectAll() {
        console.log("selecting all...");
        for (let [k,_] of this.graph.nodes) {
            this.select(Socket.new(k, 0));
        }
        this.requestRedraw();
    }

    // Ctrl + Z
    onUndo() {
        console.log("undoing...");      
        let change = this.graphHistory.undo(); 
        if (change) this.onChange();
    }

    // Ctrl + Y
    onRedo() {
        console.log("redoing..."); 
        let change = this.graphHistory.redo(); 
        if (change) this.onChange();
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
        this.menu.updateCategories(this);
    }

    async testGraph() {
        let js = `
        function anonymous(a /* "widget": "button" | "state": "true" | "x": 2 | "y": -1  */,c /* "widget": "button" | "state": "false" | "x": 2 | "y": 2 */
        ) {
            let [b] = bool.NOT(a) /* "x": 8 | "y": -1 */;
            let [d] = bool.OR(a, c) /* "x": 8 | "y": 2 */;
            let [e] = bool.AND(b, d) /* "x": 13 | "y": 0 */;
            return [e /* "widget": "lamp" | "x": 18 | "y": -1 */, e /* "widget": "image" | "x": 8 | "y": 5 */];
        }
        `;

        this.reset(NodesGraph.fromJs(js, this.catalogue)!);
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
        this.menu.updateCategories(this);
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
        let ex = this.tryGetSelectedSocket(s.node);
        if (!ex) {
            this.selectedSockets.push(s);
        } else {
            ex.cloneFrom(s);
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
            this.graphHistory.doAddNode(this.catalogue.selected!, gp);
            // this.graph.addNode(this.catalogue.spawn(gp)!);
            if (!this.input.IsKeyDown("control")) {
                this.catalogue.deselect();
            }
            this.requestRedraw();
            return;
        } 
        
        // we clicked at some spot. try to select something 
        let socket = this.trySelect(gp);
        if (!socket) {
            // we clicked an empty spot: deselect and draw a box
            this.deselect();
            this.startBox(gp);
            this.requestRedraw();
            return;
        } 

        // we clicked on a socket!
        let shift = this.input.IsKeyDown("shift") 
        let sock = this.tryGetSelectedSocket(socket.node)
        if (shift) {
            console.log("shift");
            socket.idx = 0;
        }
        if (sock) {
            // do nothing if we click on a node we already have selected. This is needed for click and dragging multiple nodes
            console.log("when")
        } else if (!shift) {
            this.deselect();
        }

        this.select(socket);
        if (socket?.side == SocketSide.Widget) {
            // we just clicked a widget! let the widget figure out what to do
            (this.graph.getNode(socket.node)?.core as Widget).onClick(this);
        } 
        
        this.requestRedraw();   
        return;   
    }


    onMouseUp(gp: Vector2) {
        // console.log("up!");

        // possibly create a move event for undo-ing
        if (this.mgpStart && this.mgpEnd && !this.mgpStart.equals(this.mgpEnd) && 
            this.selectedSockets.length > 0 && (this.selectedSockets.length > 1 || this.selectedSockets[0].side == SocketSide.Body)) {
            // record history
            let keys = this.selectedSockets.map(s => s.node);
            console.log(keys);
            this.graphHistory.recordMove(keys, this.mgpEnd.subbed(this.mgpStart));
        }

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
        let s = this.trySelect(gp);
        if (s && this.input.IsKeyDown("shift")) {
            console.log("shift when move");
            s.idx = 0;
            console.log(s);
        }
        this.hover(s);
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
