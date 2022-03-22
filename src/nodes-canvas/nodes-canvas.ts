import { Vector2, InputState, Domain2, MultiVector2, Key, GeonMath, createRandomGUID } from "../../../engine/src/lib";
import { CtxCamera } from "./rendering/ctx/ctx-camera";
import { CTX, resizeCanvas } from "./rendering/ctx/ctx-helpers";
import { NodesGraph } from "./model/graph";
import { Socket, SocketSide } from "./model/socket";
import { Widget } from "./model/widget";
import { Catalogue } from "../modules/catalogue";
import { ModuleShim } from "../modules/shims/module-shim";
import { drawMultiCable, generateCableLine, drawNode, DrawState, renderCable } from "./rendering/nodes-rendering";
import { IO } from "./util/io";
import { History } from "./model/history";
import { HTML } from "../html/util";
import { offsetOverlayEvent, setMenu, setRightPanelOld } from "../html/registry";
import { Menu } from "../menu/menu";
import { State } from "./model/state";
import { mapmap } from "./util/misc";
import { StopVisualizePreviewEvent, VisualizePreviewEvent } from "../viewer/viewer-app";
import { Settings } from "./model/settings";
import { CoreType } from "./model/core";
import { makeMenuFromWidget } from "../menu/right-menu/widget-menu";
import { makeMenuFromNode } from "../menu/right-menu/node-menu";
import { GraphConversion } from "./logic/graph-conversion";
import { Cable, CableStyle } from "./model/cable";
import { GraphCalculation } from "./logic/graph-calculation";
import { makeMenuFromCable } from "../menu/right-menu/param-menu";

/**
 * Represents the entire canvas of nodes.
 * - Controls what happens with the nodes (creation / selection / deletion)
 * - Draws the nodes
 */
export class NodesCanvas {
    
    private redrawAll = true;
    private _size = 24;
    get size() { return this._size; }

    // selection state 
    private selectedSockets: Socket[] = [];
    private hoverSocket?: Socket;
    private mgpStart? = Vector2.new(); // mouse grid point start of selection
    private mgpEnd? = Vector2.new(); // mouse grid point end of selection 
    public mgpHover = Vector2.new(); // mouse grid point hover

    // used to box select
    private boxStart: Vector2 | undefined;
    public clipboardStorage?: string;

    private constructor(
        private readonly ctx: CTX,
        private readonly camera: CtxCamera,
        private readonly input: InputState,
        public graph: NodesGraph,
        public graphHistory: History,       
        public catalogue: Catalogue,
        public settings: Settings,
        ) {}


    static new(htmlCanvas: HTMLCanvasElement, catalogue: Catalogue) {

        const ctx = htmlCanvas.getContext('2d');
        if (!ctx || ctx == null) {
            alert("Canvas Rendering not supported in your browser. Try upgrading or switching!"); 
            return undefined;
        } 

        const camera = CtxCamera.new(ctx.canvas, Vector2.new(-100,-100), 1);
        const state = InputState.new(ctx.canvas);
        const graph = NodesGraph.new();
        const graphDecoupler = History.new(graph);
        const settings = new Settings();
        // fill the html of menu now that menu is created
        
        let canvas = new NodesCanvas(ctx, camera, state, graph, graphDecoupler, catalogue, settings);
        return canvas;
    }


    async start() {

        // hook up all functions & listeners
        // window.addEventListener("resize", () => this.onResize());
        // this.ctx.canvas.addEventListener("blur", () => console.log("blur")); 
        // this.ctx.canvas.addEventListener("focus", () => console.log("focus")); 
        // this.ctx.canvas.addEventListener("mouseout", () => console.log("mouseout")); 
        // this.onResize();

        this.camera.onMouseDown = (worldPos, double) => {
            this.onMouseDown(this.toGrid(worldPos), double);
        }
        this.camera.onMouseUp = (worldPos: Vector2) => {
            this.onMouseUp(this.toGrid(worldPos));
        }

        // this.menu.updateCategories(this);
        this.testGraph();

        // show the settings page of the canvas
        HTML.dispatch(setRightPanelOld, this);
    }

    
    async testGraph() {
        // let js = `
        // function anonymous(a /* "widget": "button" | "state": "true" | "x": -2 | "y": -1  */,c /* "widget": "button" | "state": "false" | "x": -2 | "y": 2 */
        // ) {
        //     let [aFixed] = various.toBoolean(a) /* "x": 3 | "y": -1 */;
        //     let [cFixed] = various.toBoolean(c) /* "x": 3 | "y": 2 */;

        //     let [b] = bool.not(aFixed) /* "x": 8 | "y": -1 */;
        //     let [d] = bool.or(aFixed, cFixed) /* "x": 8 | "y": 2 */;
        //     let [e] = bool.and(b, d) /* "x": 13 | "y": 0 */;
        //     return [e /* "widget": "lamp" | "x": 18 | "y": -1 */, e /* "widget": "image" | "x": 8 | "y": 5 */];
        // }
        // `;

        let js = `
        function anonymous(a /* "widget": "input" | "state": "7" | "x": -2 | "y": -1  */,c /* "widget": "input" | "state": "4" | "x": -2 | "y": 3 */
        ) {
            let [aFixed] = various.asNumber(a) /* "x": 3 | "y": -1 */;
            let [cFixed] = various.asNumber(c) /* "x": 3 | "y": 3 */;
            let [d] = types.vector(aFixed, cFixed, cFixed) /* "x": 8 | "y": -1 */;
            let [e] = types.vector(cFixed, aFixed, aFixed) /* "x": 8 | "y": 3 */;
            let [f] = types.line(d, e) /* "x": 13 | "y": 5 */;
            return [d /* "widget": "view" | "x": 18 | "y": -1 */, e /* "widget": "view" | "x": 18 | "y": 2 */, f /* "widget": "view" | "x": 18 | "y": 5 */];
        }
        `;

        this.resetGraph(NodesGraph.fromJs(js, this.catalogue)!);
        // this.graph.log();
        return;
    }


    resetGraph(graph= NodesGraph.new()) {
        this.graph = graph;
        this.graphHistory.reset(graph);
        this.graph.onWidgetChangeCallback = this.onChange.bind(this);
        this.onChange();
    }


    /////////////////////////////////////////////////////////////////

    /**
     * This also belongs somewhere else I think...
     */
    getSelectedOutputs() {
        let outputs: Socket[] = [];
        for (let socket of this.selectedSockets) {
            if (socket.side == SocketSide.Output) {
                outputs.push(socket);
            } else if (socket.side == SocketSide.Body) {
                let node = this.graph.getNode(socket.hash)!;
                node.forEachOutputSocket(s => outputs.push(s));
            }
        }
        return outputs;
    }

    /**
     * TODO this belongs somewhere else...
     */
    tryGetCache(s: Socket) {
        if (s.side != SocketSide.Output) return undefined;
        return this.graph.getDatum(s)!.state; 
    }

    /////////////////////////////////////////////////////////////////

    async onChange() {
        let succes = await GraphCalculation.full(this.graph);
        this._requestRedraw();
    }


    /**
     * Ctrl + D
     */
    onDuplicate() {
        let str = this.onCopy();
        this.onPaste(str);
    }


    // Ctrl + S
    onSave() {
        console.log("saving...");
        let json = GraphConversion.toJSON(this.graph);
        let str = JSON.stringify(json, null, 2)
        IO.promptSaveFile("graph.json", str);
    }


    // Ctrl + L
    onLoad() {
        console.log("loading...");
        IO.promptLoadTextFile((textFile) => {
            // TODO check if valid. etc. etc. 
            if (!textFile) {
                return;
            }
            let str = textFile.toString();
            let json = JSON.parse(str);
            this.resetGraph(GraphConversion.fromJSON(json, this.catalogue)!);
        })
    }


    onLoadJs() {
        console.log("loading from javascript...");
        IO.promptLoadTextFile((str) => {
            
            // TODO check if valid. etc. etc. 
            if (!str) {
                return;
            }
            this.resetGraph(NodesGraph.fromJs(str.toString(), this.catalogue)!);
        })
    }

    
    onSaveJs() {
        console.log("saving as javascript...");
        let text = this.graph.toJs("graph").toString();
        IO.promptSaveFile("graph.js", text, "text/js");
    }


    // Ctrl + X
    onCut() : string {  
        let hashes = this.selectedSockets.map((s => s.hash));
        this.graphHistory.deleteNodes(hashes); 
        let subgraph = this.graph.subgraph(hashes);
        let json = GraphConversion.toJSON(subgraph);
        let str = JSON.stringify(json, null, 2)
        console.log(json);
        return str; 
    }


    // Ctrl + C
    onCopy() : string {
        let hashes = this.selectedSockets.map((s => s.hash));
        let subgraph = this.graph.subgraph(hashes);
        let json = GraphConversion.toJSON(subgraph);
        let str = JSON.stringify(json, null, 2)
        console.log(json);
        return str; 
    }


    // Ctrl + V
    onPaste(str: string) {

        // TODO check if it is a json...
        // TODO check if it is a valid json...

        // generate a new graph from a string 
        let json = JSON.parse(str);
        let addition = GraphConversion.fromJSON(json, this.catalogue);
        if (!addition) return;

        // move all the nodes to make the addition distinct
        addition.nodes.forEach((n)=>n.position.addn(1,1));

        // replace hashes
        let oldHashes = mapmap(addition.nodes, (k, v) => v.hash); // dont edit list while iterating it
        for (let oldHash of oldHashes) {
            if (!this.graph.nodes.has(oldHash)) continue;
            let newKey = createRandomGUID().substring(0, 13);
            addition.replaceHash(oldHash, newKey);
        }

        // add those nodes directly, but do 
        this.graph.addGraph(addition);
        this.graphHistory.recordAddNodes(Array.from(addition.nodes.values()));
        
        // select all new nodes
        this.deselect();
        for (let [k, v] of addition.nodes) {
            this.select(Socket.new(k, 0));
        }

        // recalc
        this.onChange();
    }


    // Ctrl + A
    onSelectAll() {

        // i do this so the last selection will send a message
        let length = this.graph.nodes.size;
        let count = 0;

        console.log("selecting all...");
        for (let [k,_] of this.graph.nodes) {
            count += 1;
            this.select(Socket.new(k, 0), count == length);
        }
        this._requestRedraw();
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


    // TODO make this nicer...
    collapseCounter = 1;
    collapseGraphToOperation() {
        let GRAPH = this.graph.toJs("GRAPH" + this.collapseCounter);
        this.collapseCounter += 1;
        
        // @ts-ignore;
        let graph = Blueprint.new(GRAPH);
        if (this.catalogue.modules.has("graphs")) {
            this.catalogue.modules.get("graphs")!.blueprints.push(graph);
        } else {
            this.catalogue.addLibrary(ModuleShim.new("graphs", "braces", "", {},[graph], []));
        }
        // update the UI...
        console.warn("TODO UPDATE THE NEW UI");
    }


    /**
     * NOTE: this is sort of the main loop of the whole node canvas
     * @param dt 
     */
    update(dt: number) {
        this.input.preUpdate(dt);

        let redraw = this.camera.update(this.input);
        if (redraw) {
            HTML.dispatch(offsetOverlayEvent, this.camera.pos);
            this._requestRedraw();
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
            this._requestRedraw();
        }

        if (this.input.IsKeyPressed("delete")) {
            this.onDelete();
        }

        if (this.input.IsKeyPressed("m")) {
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


    _requestRedraw() {
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
        // this.drawGrid(ctx);

        let isCableSelected = (socket: Socket, con: Socket) => {
            for (let selected of this.selectedSockets) {
                if (selected.side == SocketSide.Body) {
                    if (socket.hash == selected.hash) return true;
                    if (con.hash == selected.hash) return true;
                } else {
                    if (socket.equals(selected)) return true;
                    if (con.equals(selected)) return true;
                }
            }
            return false;
        }

        // draw cables 
        for (let [hash, node] of this.graph.nodes) {
            node.forEachOutputSocket((socket, cons) => {
                if (cons.length == 0) return;
                let normalCons = []
                let selectedCons = [];

                let datum = this.graph.getDatum(socket);

                // figure out if selected
                for (let con of cons) {
                    if (isCableSelected(socket, con)) {
                        selectedCons.push(con);
                    } else {
                        normalCons.push(con);
                    }
                }

                // draw accordingly
                let cableHash = socket.toString();

                let style = datum?.style || CableStyle.Off;
                drawMultiCable(ctx, socket, normalCons, style, this, this.graph);
                if (selectedCons.length > 0) 
                    drawMultiCable(ctx, socket, selectedCons, CableStyle.Selected, this, this.graph);
            })
        }

        // draw a cable if we are dragging a new cable
        if (this.mgpStart) {
            for (let socket of this.selectedSockets) {
                let fromNode = this.graph.nodes.get(socket.hash)!;
                let p = fromNode.getConnectorGridPosition(socket.idx)!;
    
                if (socket.side == SocketSide.Input) {
                    renderCable(ctx, g, p, this, CableStyle.Dragging);
                } else if (socket.side == SocketSide.Output) {
                    renderCable(ctx, p, g, this, CableStyle.Dragging);
                }
            }
        }

        // draw nodes 
        for (let [key, node] of this.graph.nodes) {
            
            // TODO: fix the fact we cannot hover the node of the socket we are selecting...
            let selectedSocket = this.tryGetSelectedSocket(key);
            if (selectedSocket) {
                drawNode(ctx, node, this, selectedSocket.idx, DrawState.OpSelected);
            } else if (this.hoverSocket && key == this.hoverSocket!.hash) {
                drawNode(ctx, node, this, this.hoverSocket.idx, DrawState.OpHover);
            } else {
                drawNode(ctx, node, this, 0, DrawState.Op);
            }
        }

        // draw selection box
        if (this.boxStart && !this.boxStart.equals(this.mgpHover)) {
            let a = this.toWorld(this.boxStart);
            let b = this.toWorld(this.mgpHover.added(Vector2.new(1,1)));
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


    onDelete() {
        console.log("DELETE");
        if (this.selectedSockets.length == 0) return;
        let socket = this.selectedSockets[0];
        let side = socket.side;

        if (this.selectedSockets.length == 1 && side == SocketSide.Input) {
            console.log("input")
            
            let con = this.graph.getInputConnectionAt(socket);
            if (!con) return;
            this.graphHistory.removeConnection(con, socket);
            this.deselect();
            this._requestRedraw();
            return;
        }

        if (this.selectedSockets.length == 1 && side == SocketSide.Output) {
            console.log("output")
            let cons = this.graph.getOutputConnectionsAt(socket);
            if (cons.length == 0) return;
            console.log(cons.length);
            for (let i = cons.length - 1 ; i > -1; i-=1) {
                console.log("repeat");
                this.graphHistory.removeConnection(socket, cons[i]);
            }
            this.deselect();
            this._requestRedraw();
            return;
        }


        this.graphHistory.deleteNodes(this.selectedSockets.map(s => s.hash));
        this.deselect();
        this._requestRedraw();
        return;
    
    }


    hover(s?: Socket) {
        this.hoverSocket = s;
    }


    dehover() {
        this.hoverSocket = undefined;
    }

    selectMultiple(sockets: Socket[], setMenu=true) {
        for (let socket of sockets) {
            let ex = this.tryGetSelectedSocket(socket.hash);
            if (!ex) {
                this.selectedSockets.push(socket);
            } else {
                ex.cloneFrom(socket);
            }
        }
        if (setMenu) this.onSelectionChange();
    }

    select(socket: Socket, setMenu=true) { 

        let ex = this.tryGetSelectedSocket(socket.hash);
        if (!ex) {
            this.selectedSockets.push(socket);
        } else {
            ex.cloneFrom(socket);
        }
        
        if (setMenu) this.onSelectionChange();
    }
 

    deselect() {
        this.selectedSockets = [];
        this.onSelectionChange();
    }


    onSelectionChange() {

        // possibly visualize some geometry
        if (this.settings.previewSelection) {
            if (this.selectedSockets.length == 0) {
                HTML.dispatch(StopVisualizePreviewEvent)
            } else {
                HTML.dispatch(VisualizePreviewEvent, this);
            }
        }

        // possibly open up a menu
        let s = this.selectedSockets[0];
        if (this.selectedSockets.length == 0 ) {
            HTML.dispatch(setRightPanelOld, this);
        } else if (this.selectedSockets.length > 1) {
            let nodes = this.selectedSockets.map((s) => this.graph.getNode(s.hash)!);
            HTML.dispatch(setRightPanelOld, nodes);
        } else if (s.side == SocketSide.Body) {
            // new way of opening a menu
            let node = this.graph.getNode(s.hash)!;
            if (node.type == CoreType.Operation) {
                HTML.dispatch(setMenu, {title: "Operation", data: {node, nodes: this}, callback: makeMenuFromNode})
            } else {
                HTML.dispatch(setMenu, {title: "Widget", data: node, callback: makeMenuFromWidget})
            }
        } else if (s.side == SocketSide.Input) {
            let outputSocket = this.graph.getInputConnectionAt(s);
            if (!outputSocket) return;
            let datum = this.graph.getDatum(outputSocket)!;
            HTML.dispatch(setMenu, {title: "Input", data: datum, callback: makeMenuFromCable});
        } else if (s.side == SocketSide.Output) {
            let datum = this.graph.getDatum(s);
            HTML.dispatch(setMenu, {title: "Output", data: datum, callback: makeMenuFromCable});
            // let state = this.graph.getDatum(s)!.state;
            // HTML.dispatch(setRightPanelOld, {state, socket: s});
        }
    }


    tryGetSelectedSocket(key: string) : Socket | undefined {
        for (let socket of this.selectedSockets) {
            if (socket.hash == key) {
                return socket;
            }
        }
        return undefined;
    }


    trySelect(gridPos: Vector2) : Socket | undefined {
        // go in reverse order
        let revKeys = Array.from(this.graph.nodes.keys()).reverse();
        for (let key of revKeys) {
            let node = this.graph.getNode(key)!;
            let res = node.trySelect(gridPos);
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
        if (!this.boxStart || this.boxStart.equals(this.mgpHover)) {
            this.boxStart = undefined;
            return;
        }

        // if a node falls in the box space, select it
        let box = Domain2.fromInclude(MultiVector2.fromList([this.boxStart, this.mgpHover]));
        // console.log(box.x.t0, box.x.t1, box.y.t0, box.y.t1);
        box.offset([-2,1,-2,1])
        // console.log(box);
        let selection = [];
        for (let [key, node] of this.graph.nodes) {
            if (box.includesEx(node.position)) {
                selection.push(Socket.new(key, 0));
            }
        }
        this.selectMultiple(selection);

        // reset the box
        this.boxStart = undefined;
        // this.mgpHover = undefined;
    }


    ///////////////////////////////////////////////////////////////////////////


    setZoom(zoom: number) {
        this._size = GeonMath.clamp(zoom, 10, 50);
    }


    getZoom() {
        return this._size;
    }

    
    // ------ Events

    
    tryGetbpFromLibrary(library: string, name: string) {
                
        let lib = this.catalogue.modules.get(library);        

        if (!lib) {
            console.warn(`lib ${lib} not found!`);
            return undefined
        }

        for (let bp of lib.blueprints) {
            if (name == bp.nameLower) {
                return bp;
            }
        }

        for (let wid of lib.widgets) {
            if (name == wid.nameLower) {
                return wid;
            }
        }

        // console.warn(`lib found, but function ${name} not found`);
        return undefined;
    }


    promptForNode(gp: Vector2) {
        let text = prompt("", "");
        
        if (!text) {
            console.warn("no input!");
            return undefined;
        }
        
        // try to extract name & library from the input text
        let name = undefined;
        let library = undefined;
        let parts = undefined;
        let initState = undefined;

        // TODO : build regex expressions to extract certain patterns 
        // ["hallo"] => input with "hello" writing
        // [123] => integer input 
        // [1.2] => float input
        // [slider 1 10 0.1] => slider from 1 to 10 with steps of 0.1
        // [range 0 10] => range from 0 to 10

        if (text.includes('//')) {
            // something special for quick inputs
            name = "input";

            // try to get the initstate.
            initState = text.split('// ')[1];
            let float = Number.parseFloat(initState);
            let int = Number.parseInt(initState);
            if (float && initState.includes('.')) {
                console.log("its float")
                initState = float;
            } else if (int) {
                console.log("its int", int);
                initState = int;
            } 
        } else {
            parts = text.split('.');
            if (parts.length == 0) {
                console.warn("no input!");
                return undefined;
            } else if (parts.length == 1) {
                name = parts[0].toLowerCase();
            } else {
                library = parts[0].toLowerCase();
                name = parts[1].toLowerCase();
            }  
        }

        // if no library was detected, brute force!
        if (!library) {
            for (let lib of this.catalogue.modules.keys()) {
                let blueprint = this.tryGetbpFromLibrary(lib, name);
                if (blueprint) {
                    this.graphHistory.addNode(blueprint, gp, initState);
                    this.onChange();
                    return "";
                }
            } 

            console.warn("none of the libraries know this method!");
            return undefined;
        }

        // else, try to select something with library and name
        let thing = this.tryGetbpFromLibrary(library, name);
        if (!thing) {
            console.warn("no blueprint found");
            return undefined;
        }
        this.graphHistory.addNode(thing, gp);
        this.onChange();
        return "";
    }


    onMouseDown(gp: Vector2, doubleClick: boolean) {
        if (doubleClick) return;
        // console.log(doubleClick);
        
        // console.log("down!");
        this.mgpStart = gp;
        this.mgpEnd = gp;

        if (this.catalogue.selected) {
            // we are placing a new node
            this.graphHistory.addNode(this.catalogue.selected!, gp);
            // this.graph.addNode(this.catalogue.spawn(gp)!);
            this.catalogue.deselect();
            this.onChange();
            return;
        } 
        
        let socket = this.trySelect(gp);
        let shift = this.input.IsKeyDown("shift") 
        if (!socket) {
            
            // we clicked an empty spot: deselect
            if (!shift) this.deselect();
            
            // if (doubleClick) {
            //     this.promptForNode(gp);
            // }

            // deselect and draw a box
            this.startBox(gp);
            this._requestRedraw();
            return;
        } 

        // we clicked on a socket!
        let sock = this.tryGetSelectedSocket(socket.hash)
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
        if (socket?.side == SocketSide.Widget && !doubleClick) {
            // we just clicked a widget! let the widget figure out what to do
            (this.graph.getNode(socket.hash)?.core as Widget).onClick(this);
        } 
        
        this._requestRedraw();   
        return;   
    }


    onMouseUp(gp: Vector2) {
        // console.log("up!");

        // possibly create a move event for undo-ing
        if (this.mgpStart && this.mgpEnd && !this.mgpStart.equals(this.mgpEnd) && 
            this.selectedSockets.length > 0 && (this.selectedSockets.length > 1 || this.selectedSockets[0].side == SocketSide.Body)) {
            // record history
            let keys = this.selectedSockets.map(s => s.hash);
            this.graphHistory.recordMoveNodes(keys, this.mgpEnd.subbed(this.mgpStart));
        }

        // possibly create a line
        // see if the line drawn is indeed from input to output, or vise versa
        if (this.selectedSockets.length == 1 && this.hoverSocket) {
            let selectedSocket = this.selectedSockets[0];
            if ((selectedSocket.side == SocketSide.Input && this.hoverSocket.side == SocketSide.Output) || 
            (selectedSocket.side == SocketSide.Output && this.hoverSocket.side == SocketSide.Input)) {
            
                // new line means recalculation
                console.log("adding cable...")
                let control = this.input.IsKeyDown("control")
                if (control) {
                    this.graphHistory.removeConnection(selectedSocket, this.hoverSocket!);
                } else {
                    this.graphHistory.addConnection(selectedSocket, this.hoverSocket!);
                }
                this.deselect();
                this.onChange();
            }
        } 

        // reset
        this.stopBox();
        this.mgpStart = undefined;
        this.mgpEnd = undefined;
        this._requestRedraw();
    }


    /**
     * fires when the mouse moves over to a new gridcell
     */
    onMouseGridMove(gp: Vector2) {

        // console.log("move!");

        // hovering
        let s = this.trySelect(gp);
        if (s && this.input.IsKeyDown("shift")) {
            s.idx = 0;
            // console.log(s);
        }
        this.hover(s);
        this._requestRedraw();

        // drag a line perhaps 
        if (!this.mgpStart) {
            return;
        }
        if (this.selectedSockets.length == 1 
            && this.selectedSockets[0].side != SocketSide.Body) {
            // dragging line
            // console.log("drag line");
        } else {
            // we are dragging something
            let delta = gp.subbed(this.mgpEnd!);
            for (let socket of this.selectedSockets) {
                    let node = this.graph.nodes.get(socket.hash);
                    node?.position.add(delta);
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
        // resizeCanvas(this.ctx);
        this._requestRedraw();
    }
}
