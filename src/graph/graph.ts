import { Random, createGUID, createRandomGUID } from "../../../engine/src/math/random";
import { Catalogue } from "../operations/catalogue";
import { Cable, CableState } from "./cable";
import { graphToFunction, jsToGraph } from "./graph-conversion";
import { GeonNode } from "./node";
import { Socket, SocketIdx, SocketSide } from "./socket";
import { State } from "./state";
import { Widget, WidgetSide } from "./widget";

/**
 * A Collection of Nodes, Gizmo's & Cables. 
 * These are doubly linked. (Nodes point to cables, cables point to nodes).
 * The Graph makes sure these links remain correct
 */
export class NodesGraph {

    constructor(
        public nodes: Map<string, GeonNode>, 
        public cables: Map<string, Cable>,
        public widgets: Map<string, Widget>) {}

    static new(
        nodes = new Map<string, GeonNode>(),
        cables = new Map<string, Cable>(),
        widgets = new Map<string, Widget>()) {
        return new NodesGraph(nodes, cables, widgets);
    }
    
    static fromJs(js: string, catalogue: Catalogue) {
        // TODO
        let graph = jsToGraph(js, catalogue);
        if (!graph) {
            console.warn("could not create graph from js");
            return NodesGraph.new();
        } else {
            return graph;
        }
    }

    toJs(name: string) {
        return graphToFunction(this, name);
    }

    // ---- True Graph Business 

    /**
     * Calculate the entire graph:
     * - start with the data from input widgets
     * - calculate all operations 
     * - store results in output widgets
     * TODO: build something that can recalculate parts of the graph
     */
    calculate() {

        let cache = new Map<string, State>();
        let orderedNodeKeys = this.kahn();

        let setCache = (key: string, value: State) => {
            let cable = this.getCable(key)!;
            if (!cable) {
                return;
            }
            if (value) {
                cable.state = CableState.On;
            } else {
                cable.state = CableState.Off;
            }
            cache.set(key, value);
        }

        //start at the widgets (widget keys are the same as the corresponding node)
        for (let key of orderedNodeKeys) {
   
            let node = this.getNode(key)!;

            // calculate in several ways, depending on the node
            if (node.operation) { // A | operation -> pull cache from cables & push cache to cables
                
                let inputs = [];
                for (let cable of node.inputs()) { // TODO multiple inputs!!
                    inputs.push(cache.get(cable)!);
                }

                let outputs = node.operation.run(...inputs);
                let outCables = node.outputs();
                if (typeof outputs !== "object") {
                    setCache(outCables[0], outputs);
                } else {
                    for (let i = 0 ; i < node.operation.outputs; i++) {
                        setCache(outCables[i], outputs[i]);
                    }
                }
            } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget -> push cache to cable
                for (let cable of node.outputs()) {
                    setCache(cable, node.widget!.state);
                }
            } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget -> pull cache from cable
                for (let cable of node.inputs()) { // TODO multiple inputs!!
                    node.widget!.state = cache.get(cable)!;
                }
            } else {
                throw new Error("should never happen");
            }
        }
    }

    /**
     * An implementation of kahn's algorithm: 
     * https://en.wikipedia.org/wiki/Topological_sorting
     */
    kahn() {
        // fill starting lists
        let L: string[] = [];
        let S: string[] = [];
        let visitedCables: Set<string> = new Set<string>();

        // use the widgets to identify the starting point
        for (let [key, _] of this.widgets) {
            let widget = this.getNode(key)!.widget!;
            if (widget.side != WidgetSide.Input) 
                continue; 
            S.push(key);
        }

        while (true) {

            let node = S.pop();
            if (node == undefined) 
                break;
            L.push(node);

            // for each node m with an edge e from n to m do
            for (let cable of this.getNode(node)!.outputs()) {
                
                // 'remove' edge e from the graph
                if (visitedCables.has(cable))
                    continue;
                visitedCables.add(cable);

                // if m has no other incoming edges then
                //    insert m into S
                for (let nb of this.getCable(cable)!.to) {
                    let m = nb.node;
                    let allVisited = true;
                    for (let c of this.getNode(m)!.inputs()) {
                        if (!visitedCables.has(c)) {
                            allVisited = false;
                            break;
                        }
                    }
                    if (allVisited) {
                        S.push(m);
                    }
                }
            }
        }

        return L;
    }

    // ---- Node Management 

    addNode(node: GeonNode) {
        let key = createRandomGUID();
        this.nodes.set(key, node);
        if (node.core instanceof Widget) {
            this.widgets.set(key, node.core);
        }
        return key;
    }

    getNode(key: string) {
        return this.nodes.get(key);
    }

    deleteNode(nkey: string) {
        let node = this.nodes.get(nkey)!;

        // pull all connections at connectors
        for (let [idx, cable] of node.connections) {
            this.emptySocket(cable, Socket.new(nkey, idx))
        }

        // remove the widget pointer
        if (node.core instanceof Widget) {
            this.widgets.delete(nkey);
        }

        return this.nodes.delete(nkey);
    }

    getCable(key: string) {
        return this.cables.get(key);
    }

    private fillSocket(ckey: string, c: Socket) {
        let cable = this.cables.get(ckey)!;
        
        // remove existing connections
        if (c.side == SocketSide.Output) {
            // take care of this one level higher than this
        } else if (c.side == SocketSide.Input) {
            // make sure the socket is empty
            let existingTo = this.getCableAtConnector(c);
            if (existingTo) {
                this.emptySocket(existingTo, c);
            }
        }

        // add the new connection
        this.setNodeCableConnection(ckey, c);
    }

    private emptySocket(ckey: string, c: Socket) {
        let cable = this.cables.get(ckey)!;

        // console.log("EMPTYING A SOCKET FROM "+ this.nodes.get(c.node)?.core.name)
        if (c.side == SocketSide.Output) {
            // if connection is input, delete the entire cable
            // console.log("EMPTY Output...");
            // console.log("WE NEED TO DELETE THE ENTIRE CABLE");
            for (let to of cable.to) {
                this.emptySocket(ckey, to);
            }
            this.cables.delete(ckey);
        } else if (c.side == SocketSide.Input) {
    
            cable._to.delete(c.toString());
            if (cable._to.size == 0) {
                // this will delete the cable as well
                this.emptySocket(ckey, cable.from);
                
            } 
            // console.log("WE NEED TO DELETE THE ENTIRE CABLE ONLY IF WE ARE THE LAST");
        }

        // remove the node pointer 
        this.removeNodeConnection(c);

        return true;
    }

    // ---- Cable Management

    addCable(a: Socket, b: Socket) {

        // before we create the cable, make sure the sockets are free
        let cable = Cable.new(a, b);

        // If a cable exist at the start of this cable, do not add a new cable.
        // but add an additional output to this one
        let existingFrom = this.getCableAtConnector(cable.from);
        if (existingFrom) {
            console.log("adding to existing...");
            for(let to of cable.to) {
                if (existingFrom == this.getCableAtConnector(to)) {
                    console.log("this full cable exist already");
                    // if the current 'to' socket is occupied by the same cable, this is meaningless
                    return existingFrom;
                }
                this.fillSocket(existingFrom, to);
            }
            return existingFrom;
        } 

        // add the actual cable, floating in the air as it were.
        let cableKey = createRandomGUID();
        this.cables.set(cableKey, cable);

        // now plug it in
        this.fillSocket(cableKey, cable.from);
        for (let to of cable.to) {
            this.fillSocket(cableKey, to);
        }
        return cableKey;
    }
    
    addCableBetween(a: string, outputIndex: number, b: string, inputIndex: number) {
        let aComp: SocketIdx = outputIndex + 1;
        let bComp: SocketIdx = (inputIndex + 1) * -1;
        // console.log({a, outputIndex, b, inputIndex });
        this.addCable(Socket.new(a,aComp), Socket.new(b, bComp));
    }

    // ---- Connection Management

    private getCableAtConnector(c: Socket) {
        return this.nodes.get(c.node)?.connections.get(c.idx);
    }

    private setNodeCableConnection(ckey: string, c: Socket) {
        let cable = this.cables.get(ckey)!;
        let node = this.nodes.get(c.node)!;
        if (c.side == SocketSide.Input) {
            // input of node | 'to' / B of cable
            cable.add(c);
            node.connections.set(c.idx, ckey);
        } else if (c.side == SocketSide.Output) {
            // output of node | 'from' / A of cable
            cable.from = c;
            node.connections.set(c.idx, ckey);
        }
    }

    private removeNodeConnection(c: Socket) {
        return this.nodes.get(c.node)?.connections.delete(c.idx);
    }

    log() {

        console.log("GRAPH");

        console.log("NODES");
        console.log("-----");
        for (let [nkey, node] of this.nodes) {
            console.log(" node");
            console.log(" L key : ", nkey);
            console.log(" L name: ", node.core.name);
            console.log(" L connections: ");
            for (let [k, v] of node.connections) {
                console.log(`   L key: ${k} | value: ${v}`);
            }
        }

        console.log("CABLES");
        console.log("-----");
        for (let [ckey, cable] of this.cables) {
            console.log("cable")
            console.log(" L from :", cable.from.toString());
            console.log(" L to   :");
            for (let to of cable.to) {
                console.log("   L ", to.toString());
            }
        }
    }
}