import { createRandomGUID } from "../../../../engine/src/lib";
import { Catalogue, CoreType } from "../../modules/catalogue";
import { TypeShim, Type } from "../../modules/shims/parameter-shim";
import { CableState as CableVisualState } from "../rendering/cable-visual";
import { filterMap, mapFromJson, mapToJson } from "../util/serializable";
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
        private widgets: Set<string>) {}

    static new(
        nodes = new Map<string, GeonNode>(),
        widgets = new Set<string>()) {
        return new NodesGraph(nodes, widgets);
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

    static fromSerializedJson(str: string, catalogue: Catalogue) : NodesGraph {

        let json = JSON.parse(str);
        let graph = NodesGraph.new();
        for (let hash in json.nodes) {
            let node = json.nodes[hash];
            let type: CoreType = node.type;
            
            if (type == CoreType.Widget) {
                let lib = "widgets";
                let name = node.process.name;
                
                let process = catalogue.trySelect(lib, name, type);
                if (!process) {
                    console.error(`widget process: ${lib}.${name}, ${type} cannot be created. The library is probably missing from this project`);
                    continue;
                } 
                let geonNode = GeonNode.fromJson(node, process);
                if (!geonNode) {
                    console.error(`widget process: ${lib}.${name}, ${type} cannot be created. json data provided is errorous`)
                    continue;
                }
                graph.nodes.set(hash, geonNode);  
                continue; 
            }

            if (type == CoreType.Operation) {
                let lib = node.process.path[0];
                let name = node.process.name;
                
                let process = catalogue.trySelect(lib, name, type);
                if (!process) {
                    console.error(`operation process: ${lib}.${name}, ${type} cannot be created. The library is probably missing from this project`);
                    continue;
                } 
                let geonNode = GeonNode.fromJson(node, process);
                if (!geonNode) {
                    console.error(`operation process: ${lib}.${name}, ${type} cannot be created. json data provided is errorous`)
                    continue;
                }
                graph.nodes.set(hash, geonNode);  
                continue; 
            }
        }
        catalogue.deselect();
        return graph;
    }

    static toJson(graph: NodesGraph, selection?: string[]) {
        
        let nodes = graph.nodes;
        
        // O(n*n)
        if (selection) {
            nodes = filterMap(nodes, (key) => selection.includes(key));
        }
        
        return {
                nodes: mapToJson(nodes, GeonNode.toJson),
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
    async calculate() : Promise<[Map<string, State>, Map<string, CableVisualState>]> {

        let cache = new Map<string, State>();
        let visuals = new Map<string, CableVisualState>();
        let orderedNodeKeys = this.kahn();

        let setValue = (key: string, value: State) => {
            // let cable = this.getOutputConnectionsAt(key)!;
            // if (!cable) {
            //     return;
            // }

            let visual = CableVisualState.Null;
            if (value) {
                visual = CableVisualState.Boolean;
            } 
            
            visuals.set(key, visual);
            cache.set(key, value);
        }

        //start at the widgets (widget keys are the same as the corresponding node)
        for (let key of orderedNodeKeys) {
   
            let node = this.getNode(key)!;

            // calculate in several ways, depending on the node
            if (node.operation) { // A | operation -> pull cache from cables & push cache to cables
                
                let inputs = [];
                for (let cable of node.getCablesAtInput()) { // TODO multiple inputs!! ?
                    inputs.push(cache.get(cable)!);
                }
                let outputs;
                try {
                    //TODO RUN RUN RUN
                    outputs = await node.operation.run(inputs);
                } catch(e) {
                    let error = e as Error;
                    node.errorState = error.message;
                    console.warn("NODE-ERROR: \n", node.errorState);
                    continue;
                }

                let outCables = node.getCablesAtOutput();
                if (node.operation.outCount == 1) {
                    setValue(outCables[0], outputs);
                } else {
                    for (let i = 0 ; i < node.operation.outCount; i++) {
                        setValue(outCables[i], outputs[i]);
                    }
                }
                
            } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget -> push cache to cable
                for (let cable of node.getCablesAtOutput()) {
                    setValue(cable, node.widget!.state);
                }
            } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget -> pull cache from cable
                for (let cable of node.getCablesAtInput()) { // TODO multiple inputs!!
                    node.widget!.run(cache.get(cable)!);
                }
            } else {
                throw new Error("should never happen");
            }
        }
        return [cache, visuals];
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
        for (let key of this.widgets) {
            let widget = this.getNode(key)!.widget!;
            if (widget.side != WidgetSide.Input) 
                continue; 
            S.push(key);
        }

        while (true) {

            let hash = S.pop();
            if (hash == undefined) 
                break;
            L.push(hash);

            let node = this.getNode(hash)!;

            // for each node m with an edge e from n to m do
            node.forEachOutputSocket((s: Socket, connections: Socket[]) => {
                let cableHash = s.toString();
                
                // 'remove' edge e from the graph
                if (visitedCables.has(cableHash))
                    return;
                visitedCables.add(cableHash);

                // if m has no other incoming edges then
                // insert m into S
                for (let connection of connections) {
                    let m = connection.hash;
                    let allVisited = true;
                    for (let c of this.getNode(m)!.getCablesAtInput()) {
                        if (!visitedCables.has(c)) {
                            allVisited = false;
                            break;
                        }
                    }
                    if (allVisited) {
                        S.push(m);
                    }
                }
            })
        }

        return L;
    }

    clone() {

    }

    replaceHash(oldHash: string, newHash: string) {
        
        console.log({oldHash, newHash});

        let node = this.nodes.get(oldHash);
        if (!node) {
            return;
        }

        node.forEachInputSocket((input: Socket, foreignOutput: Socket | undefined) => {
            if (!foreignOutput) return;
            this.removeOutputConnectionAt(foreignOutput, input);
        })

        node.forEachOutputSocket((output: Socket, foreignInputs: Socket[]) => {
            if (foreignInputs.length == 0) return
            for (let foreignInput of foreignInputs) {
                this.setInputConnectionAt(foreignInput, undefined);
            }
        })

        // replace the key itself
        // node.hash = newHash;
        // this.nodes.set(newHash, node);
        // this.nodes.delete(oldHash);
    }

    addGraph(other: NodesGraph) { 

        // first, for every double hash, subsitute in the other graph
        for (let [key, node] of other.nodes) {
            if (this.nodes.has(key)) {
                console.warn("REPLACE!!");
                let newKey = createRandomGUID().substring(0, 13);
                other.replaceHash(key, newKey);
                return;   
            } 
        }

        // then, add them one by one
        for (let [key, node] of other.nodes) {
            this.addNode(node);
        }

        return this;
    }

    //////////////////////////////////// Nodes /////////////////////////////////////

    addNode(node: GeonNode) {
        this.nodes.set(node.hash, node);
        if (node.process instanceof Widget) {
            this.widgets.add(node.hash);
        }
        return node.hash;
    }

    getNode(key: string) {
        return this.nodes.get(key);
    }

    deleteNode(hash: string) {
        let node = this.nodes.get(hash)!;

        // pull all connections at connectors
        this.removeAllConnections(hash);

        // remove the widget pointer
        if (node.process instanceof Widget) {
            node.process.onDestroy();
            this.widgets.delete(hash);
        }

        return this.nodes.delete(hash);
    }

    //////////////////////////////////// Connections ///////////////////////////////////////

    getOutputConnectionsAt(local: Socket) : Socket[] {
        if (local.side != SocketSide.Output) throw new Error("NOPE");
        return this.nodes.get(local.hash)!.outputs[local.normalIndex()];
    }
    
    setOutputConnectionsAt(local: Socket, foreign: Socket[]) {
        if (local.side != SocketSide.Output) throw new Error("NOPE");
        this.nodes.get(local.hash)!.outputs[local.normalIndex()] = foreign;
    }
    
    hasOutputConnectionAt(local: Socket, foreign: Socket) {
        if (local.side != SocketSide.Output) throw new Error("NOPE");
        let list = this.nodes.get(local.hash)!.outputs[local.normalIndex()];
        // find and remove
        for (let i = 0 ; i < list.length; i++) {
            if (list[i].hash != foreign.hash || list[i].idx != foreign.idx) continue;
            return true;
        }
        return false;
    }

    addOutputConnectionsAt(local: Socket, foreign: Socket) {
        if (local.side != SocketSide.Output) throw new Error("NOPE");
        this.nodes.get(local.hash)!.outputs[local.normalIndex()].push(foreign);
    }
    
    removeOutputConnectionAt(local: Socket, foreign: Socket) {
        if (local.side != SocketSide.Output) throw new Error("NOPE");
        let list = this.nodes.get(local.hash)!.outputs[local.normalIndex()];

        // find and remove
        for (let i = 0 ; i < list.length; i++) {
            if (!list[i].equals(foreign)) continue;
            list.splice(i, 1);
            return 
        }
    }

    ///////////////////////////////// Types ///////////////////////////////////

    getParameterAt(socket: Socket) : TypeShim | undefined {
        
        // check if node exists
        let node = this.getNode(socket.hash);
        if (!node) {
            console.warn("node does not exist!");
            return undefined;
        }

        // check for widget
        let op = node.operation;
        if (!op) {
            return TypeShim.new("widget-param", Type.any);
        }

        // deal with different sides
        switch(socket.side) {
            case SocketSide.Input: return op.ins[socket.normalIndex()];
            case SocketSide.Output: return op.outs[socket.normalIndex()];
            default: 
                console.warn("Only SocketSide.Input and SocketSide.Output are valid")
                return undefined;
        }
    }

    /**
     * Assume the order
     */
    isConnectionValid(from: Socket, to: Socket) {
        let fromParam = this.getParameterAt(from)!;
        let toParam = this.getParameterAt(to)!;

        return fromParam?.isAcceptableType(toParam);
    }

    /////// 

    hasInputConnectionAt(local: Socket) {
        if (local.side != SocketSide.Input) throw new Error("NOPE");
        return this.nodes.get(local.hash)!.inputs[local.normalIndex()] != undefined;
    }

    getInputConnectionAt(local: Socket) : Socket | undefined {
        if (local.side != SocketSide.Input) throw new Error("NOPE");
        return this.nodes.get(local.hash)!.inputs[local.normalIndex()];
    }
    
    setInputConnectionAt(local: Socket, foreign?: Socket) {
        if (local.side != SocketSide.Input) throw new Error("NOPE");
        this.nodes.get(local.hash)!.inputs[local.normalIndex()] = foreign;
    }

    ///////

    removeAllConnections(hash: string) {
        let node = this.getNode(hash)!;

        for (let i = 0 ; i < node.process.outCount; i++) {
            let foreigns = node.outputs[i];
            if (!foreigns) continue;
            let local = Socket.fromNode(hash, i, SocketSide.Output);
            
            // remove foreign connection, then my connection
            for (let foreign of foreigns) this.setInputConnectionAt(foreign, undefined)
            this.setOutputConnectionsAt(local, []);
        }
        
        for (let i = 0 ; i < node.process.inCount; i++) {
            let foreign = node.inputs[i];
            if (!foreign) continue;
            let local = Socket.fromNode(hash, i, SocketSide.Input);
            
            // remove foreign connection, then my connection
            this.removeOutputConnectionAt(foreign, local);
            this.setInputConnectionAt(local, undefined);
        }
    }


    addCableBetween(aHash: string, outputIndex: number, bHash: string, inputIndex: number) {
        let aIndex: SocketIdx = outputIndex + 1;
        let bIndex: SocketIdx = (inputIndex + 1) * -1;
        // console.log({a, outputIndex, b, inputIndex });
        this.addConnection(Socket.new(aHash,aIndex), Socket.new(bHash, bIndex));
    }

    private addOrderedConnection(to: Socket, from: Socket) {
        
        if (!this.isConnectionValid(from, to)) {
            console.warn("connection is NOT valid!");
            return false;
        }

        // if the input socket already contains something, make sure its emptied correctly
        let fromConnections = this.getOutputConnectionsAt(from); 
        let toConnections = this.getInputConnectionAt(to);
        
        // this exact connection already exists, remove the connection instead
        if (toConnections?.hash == from.hash && toConnections.idx == from.idx) {
            console.log("exist already! removing...")
            // this.removeConnection(foreign, local);
            return false;
        }

        // if the input node is already, filled, remove whatever is there first
        if (toConnections) {
            console.log("WARNING- REMOVING SOME OTHER CONNECTION TO ALLOW THIS ONE!");
            this.removeConnection(to, toConnections);
        }

        // finally, add the mutual connection 
        this.setInputConnectionAt(to, from);
        this.addOutputConnectionsAt(from, to);
        return true;
    }

    addConnection(local: Socket, foreign: Socket) : boolean {

        // after this local.side == SocketSide.Input, foreign.side == SocketSide.Output
        if (local.side == foreign.side) {
            console.error("errorous connection!");
            return false;
        } else if (local.side != SocketSide.Input || foreign.side != SocketSide.Output) {
            return this.addOrderedConnection(foreign, local);   
        }

        return this.addOrderedConnection(local, foreign);
    }
    
    removeConnection(local: Socket, foreign: Socket) {
        if (local.side == foreign.side) {
            console.error("errorous connection!");
            return false;
        }
        
        if (local.side == SocketSide.Input) {
            this.removeOutputConnectionAt(foreign, local);
            this.setInputConnectionAt(local, undefined);
        } 

        if (local.side == SocketSide.Output) {
            this.setInputConnectionAt(foreign, undefined);
            this.removeOutputConnectionAt(local, foreign);
        }
    }

    /**
     * Use this when a node has connections, but you want to make these connections mutual
     */
    reinstateConnections(hash: string, overrideOutputConnections=false) {
        let node = this.getNode(hash)!;
        
        node.forEachInputSocket((s, connection) => {
            if (connection == undefined) return;
            if (this.hasOutputConnectionAt(connection, s)) return;
            this.addOutputConnectionsAt(connection, s);
        });

        node.forEachOutputSocket((s, connections) => {
            if (connections == []) return;
            for (let con of connections) {
                if (!overrideOutputConnections && this.hasInputConnectionAt(con)) return;
                this.setInputConnectionAt(con, s);
            }
        });
    }

    areConnectionsCorrect() : boolean {
        
        for (let [hash, node] of this.nodes) {

            node.forEachInputSocket((socket, connection) => {
                if (connection == undefined) return;
                if (!this.hasOutputConnectionAt(connection, socket)) {
                    console.warn(`${{socket, connection}}, "is not mutual! ${this.getOutputConnectionsAt(connection)} instead...`);
                    return false;
                }
            });
            
            node.forEachOutputSocket((socket, connections) => {
                if (connections == []) return;
                for (let connection of connections) {
                    if (!this.hasInputConnectionAt(connection)) {
                        console.warn(`${{socket, connection}}, "is not mutual! ${this.getOutputConnectionsAt(connection)} instead...`);
                        return false;
                    }
                }
            }); 
        }
        
        return true;
    }

    isConnectionTypeSave() {

    }

    ///////////////////////////////////////////////////////////////////////////////////

    log() {
        console.log("GRAPH");
        console.log("NODES");
        console.log("-----");
        for (let [nkey, node] of this.nodes) {
            console.log(" node");
            console.log(" L key : ", nkey);
            console.log(" L name: ", node.process.name);
            console.log(" L output-connections: ");
            node.forEachOutputSocket((socket, connections) => {
                console.log("    L ", socket.idx, " ----> ");
                connections.forEach(c=> console.log("      L", c.hash, c.idx));
            })

            console.log(" L input-connections: ");
            node.forEachInputSocket((socket, c) => {
                console.log("    L ", socket.idx, " ----> ");
                console.log("      L", c?.hash, c?.idx);
            })
        }
    }
}