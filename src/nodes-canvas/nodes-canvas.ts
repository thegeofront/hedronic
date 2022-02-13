// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { Vector2, InputState, Domain2, MultiVector2 } from "../../../engine/src/lib";
import { CtxCamera } from "./rendering/ctx/ctx-camera";
import { CTX, resizeCanvas } from "./rendering/ctx/ctx-helpers";
import { CableState } from "./components/cable";
import { NodesGraph } from "./components/graph";
import { makeOperationsGlobal } from "./components/graph-conversion";
import { Socket, SocketSide } from "./components/socket";
import { Widget } from "./components/widget";
import { Catalogue, CoreType } from "./blueprints/catalogue";
import { Library } from "./blueprints/library";
import { drawCable, drawCableBetween, drawNode, DrawState } from "./rendering/nodes-rendering";
import { Menu } from "./ui/menu";
import { IO } from "./util/io";
import { History } from "./components/history";

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
        public graphHistory: History,
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
        const graphDecoupler = History.new(graph);

        const catalogue = Catalogue.newFromStd();
        
        const menu = Menu.new(ui, htmlCanvas);

        return new NodesCanvas(ctx, camera, state, graph, graphDecoupler, menu, catalogue, stdPath);
    }


    async start() {

        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        // this.ctx.canvas.addEventListener("blur", () => console.log("blur")); 
        // this.ctx.canvas.addEventListener("focus", () => console.log("focus")); 
        // this.ctx.canvas.addEventListener("mouseout", () => console.log("mouseout")); 
        this.onResize();

        this.camera.onMouseDown = (worldPos, double) => {
            this.onMouseDown(this.toGrid(worldPos), double);
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
            
            // TODO: give these actions different files
            let control = (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey);
            let shift = e.shiftKey;      
            var key = e.key.toLowerCase(); 

            if (control && key == 'a')
                this.onSelectAll();
            else if ((control && key =='p') || (control && shift && key == 'p')) 
                this.onPrompt();
            else if (control && key == 's')
                this.onSave();
            else if (control && key == 'l')
                this.onLoad();
            else if (control && key == 'z') 
                this.onUndo();
            else if (control && key == 'd') 
                this.onDuplicate();
            else if (control && key == 'y') 
                this.onRedo();
            else if (control && key == ' ') 
                this.onTest();
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

    onChange() {
        this.graph.calculate();
        this.requestRedraw();
    }

    onNew() {
        console.log("new...");
        this.resetGraph();
    }


    resetGraph(graph= NodesGraph.new()) {
        this.graph = graph;
        this.graphHistory.reset(graph);
        this.graph.calculate();
        this.requestRedraw();
    }

    /////////////////////////////////////////////////////////////////

    /**
     * Ctrl + Spacebar
     */
    onTest() {

    }

    /**
     * Ctrl + D
     */
    onDuplicate() {
        let str = this.onCopy();
        this.onPaste(str, false);
    }

    onPrompt() {
        this.promptForNode(this.mgpHover);
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
            this.resetGraph(NodesGraph.fromSerializedJson(str.toString(), this.catalogue)!);
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
        let json = NodesGraph.toJson(this.graph, this.selectedSockets.map((s => s.node)));
        let str = JSON.stringify(json, null, 2)
        console.log(json);
        return str; 
    }


    // Ctrl + C
    onCopy() : string {
        // let str = this.graph.toJs("GRAPH").toString();
        let json = NodesGraph.toJson(this.graph, this.selectedSockets.map((s => s.node)));
        let str = JSON.stringify(json, null, 2)
        console.log(json);
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
            let libString = await IO.importLibrary(config.path);
            let mod = Library.fromJsObject(config.name, config.icon, config.fullPath, config.path, libString, this.catalogue);
            this.catalogue.addLibrary(mod);
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

        this.resetGraph(NodesGraph.fromJs(js, this.catalogue)!);
        return;
    }

    // TODO make this nicer...
    collapseCounter = 1;
    collapseGraphToOperation() {
        let GRAPH = this.graph.toJs("GRAPH" + this.collapseCounter);
        this.collapseCounter += 1;
        
        // @ts-ignore;
        let graph = Blueprint.new(GRAPH);
        if (this.catalogue.blueprintLibraries.has("graphs")) {
            this.catalogue.blueprintLibraries.get("graphs")!.blueprints.push(graph);
        } else {
            this.catalogue.addLibrary(Library.new("graphs", "braces", "", [graph], [], this.catalogue));
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
                this.graphHistory.deleteNodes(this.selectedSockets.map(s => s.node));
                this.deselect();
                this.requestRedraw();
            }
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
        if (!this.boxStart || this.boxStart.equals(this.mgpHover)) {
            this.boxStart = undefined;
            return;
        }

        // if a node falls in the box space, select it
        let box = Domain2.fromInclude(MultiVector2.fromList([this.boxStart, this.mgpHover]));
        // console.log(box.x.t0, box.x.t1, box.y.t0, box.y.t1);
        box.offset([-2,1,-2,1])
        // console.log(box);
        for (let [key, node] of this.graph.nodes) {
            
            if (box.includesEx(node.position)) {
                this.select(Socket.new(key, 0));
            }
        }
        // reset the box
        this.boxStart = undefined;
        // this.mgpHover = undefined;
    }

    // ------ Events

    
    tryGetbpFromLibrary(library: string, name: string) {
                
        let lib = this.catalogue.blueprintLibraries.get(library);        

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
            console.log(initState);
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
            for (let lib of this.catalogue.blueprintLibraries.keys()) {
                let blueprint = this.tryGetbpFromLibrary(lib, name);
                if (blueprint) {
                    this.graphHistory.addNodes(blueprint, gp, initState);
                    this.requestRedraw();
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
        this.graphHistory.addNodes(thing, gp);
        this.requestRedraw();
        return "";
    }

    onMouseDown(gp: Vector2, doubleClick: boolean) {

        console.log(doubleClick);
        
        // console.log("down!");
        this.mgpStart = gp;
        this.mgpEnd = gp;

        if (this.catalogue.selected) {
            // we are placing a new node
            this.graphHistory.addNodes(this.catalogue.selected!, gp);
            // this.graph.addNode(this.catalogue.spawn(gp)!);
            if (!this.input.IsKeyDown("control")) {
                this.catalogue.deselect();
            }
            this.requestRedraw();
            return;
        } 
        
        let socket = this.trySelect(gp);
        let shift = this.input.IsKeyDown("shift") 
        if (!socket) {
            
            // we clicked an empty spot: deselect
            if (!shift) this.deselect();
            
            if (doubleClick) {
                this.promptForNode(gp);
            }

            // deselect and draw a box
            this.startBox(gp);
            this.requestRedraw();
            return;
        } 

        // we clicked on a socket!
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
        if (socket?.side == SocketSide.Widget && !doubleClick) {
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
            this.graphHistory.recordMoveNodes(keys, this.mgpEnd.subbed(this.mgpStart));
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
            s.idx = 0;
            // console.log(s);
        }
        this.hover(s);
        this.requestRedraw();

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
                    let node = this.graph.nodes.get(socket.node);
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
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}
