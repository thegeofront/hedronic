import { createRandomGUID, Graph } from "../../../../engine/src/lib";
import { Catalogue } from "../../modules/catalogue";
import { TypeShim } from "../../modules/shims/type-shim";
import { filterMap, mapFromJson, mapToJson } from "../util/serializable";
import { GeonNode } from "./node";
import { Socket, SocketIdx, SocketSide } from "./socket";
import { State } from "./state";
import { Widget, WidgetSide } from "./widget";
import { GraphConversion } from "../logic/graph-conversion";
import { GraphCalculation } from "../logic/graph-calculation";
import { Cable, CableStyle } from "./cable";
import { TypeChecking } from "../../modules/types/type-checking";

export type OnWidgetChangeCallback = (hash: string) => void

/**
 * A Collection of Nodes, Widgets (and Cables)
 * These are doubly linked. (Nodes point to each other)
 * The Graph makes sure these links remain correct
 */
export class NodesGraph {

    private onWidgetChangeCallback?: OnWidgetChangeCallback;

    constructor(
        public nodes: Map<string, GeonNode>, 
        public widgets: Set<string>
    ) {}

    static new(
        nodes = new Map<string, GeonNode>(),
        widgets = new Set<string>()) {
        return new NodesGraph(nodes, widgets);
    }
    
    static fromJs(js: string, catalogue: Catalogue) {
        // TODO
        let graph = GraphConversion.fromJavascript(js, catalogue);
        if (!graph) {
            console.warn("could not create graph from js");
            return NodesGraph.new();
        } else {
            return graph;
        }
    }

    setWidgetChangeCallback(f: OnWidgetChangeCallback | undefined) {
        this.onWidgetChangeCallback = f;
    }

    toJs(name: string) {
        return GraphConversion.toFunction(this, name);
    }

    toJson() {
        return GraphConversion.toJson(this);
    }

    onWidgetChange(hash: string, widget: Widget) {
        let node = this.getNode(hash)!;
        setNodeToWidgetInOuts(this, node, widget);
        if (this.onWidgetChangeCallback) this.onWidgetChangeCallback(hash);
    }

    /**
     * destructor
     */
    onDestroy() {
        let keys = [];
        for (let key of this.nodes.keys()) {
            keys.push(key);
        }

        for (let key of keys) {
            this.deleteNode(key);
        }
    }

    // ---- True Graph Business 

    clone() {  
        throw new Error("TODO");
    }

    /**
     * Extract a copy of a certain selection
     * TODO: I think this does not work properly...
     * @param selection 
     */
    subgraph(selection: string[]) {
        
        // create a subgraph from the selection
        let selected = this.nodes;
        if (selection) {
            selected = filterMap(selected, (key) => selection.includes(key));
        }
        let graph = NodesGraph.new();
        for (let node of selected.values()) {
            graph.addNode(node);
        }

        return graph;
    }
    
    replaceHash(oldHash: string, newHash: string) {
        
        // console.log({oldHash, newHash});

        let node = this.nodes.get(oldHash);
        if (!node) {
            return;
        }

        node.forEachInputSocket((input: Socket, foreignOutput: Socket | undefined) => {
            if (!foreignOutput) return;
            if (!this.nodes.has(foreignOutput.hash)) return // ignore unknown sockets for copy-paste
            this.removeOutputConnectionAt(foreignOutput, input);
            this.addOutputConnectionsAt(foreignOutput, Socket.new(newHash, input.idx));
        })

        node.forEachOutputSocket((output: Socket, foreignInputs: Socket[]) => {
            if (foreignInputs.length == 0) return
            for (let foreignInput of foreignInputs) {
                if (!this.nodes.has(foreignInput.hash)) continue // ignore unknown sockets for copy-paste
                this.setInputConnectionAt(foreignInput, Socket.new(newHash, output.idx));
            }
        })

        // replace the key itself
        node.hash = newHash;
        this.nodes.set(newHash, node);
        this.nodes.delete(oldHash);
    }

    addGraph(other: NodesGraph) { 

        // this new graph can be externally connected to invalid / unmutual things. 
        // allow existing inputs if they can be found on the existing canvas
        // but remove all others

        // add one by one, make connections mutual
        for (let [key, node] of other.nodes) {
            
            // make sure that whatever we add, we wont override existing keys
            if (this.nodes.has(key)) {
                console.warn("DUPLCATES NOT ALLOWED!")
                continue;   
            } 
            this.addNode(node);

            // make inputs mutual if possible, else remove them
            node.forEachInputSocket((input: Socket, foreignOutput: Socket | undefined) => {
                if (!foreignOutput) return;
                if (this.nodes.has(foreignOutput.hash)) {
                    if (!this.hasOutputConnectionAt(foreignOutput, input)) {
                        this.addOutputConnectionsAt(foreignOutput, input);
                    }
                } else {
                    this.setInputConnectionAt(input, undefined);
                    return
                }
            })
    
            node.forEachOutputSocket((output: Socket, foreignInputs: Socket[]) => {
                if (foreignInputs.length == 0) return
                let fis = foreignInputs.map(i => Socket.new(i.hash, i.idx))
                for (let fi of fis) {
                    if (other.nodes.has(fi.hash)) continue;
                    this.removeOutputConnectionAt(output, fi);
                }
            })
        }

        return this;
    }

    //////////////////////////////////// Data /////////////////////////////////////


    getCable(socket: Socket) {
        // do a bunch of saveguards
        let node = this.nodes.get(socket.hash)!
        if (!node) {console.warn("could not find node to store datum"); return }
        if (socket.side != SocketSide.Output) {console.warn("not a valid datum socket"); return }
        let index = socket.normalIndex();
        if (index >= node.cables.length) {console.warn("datum at output", index, "does not exist!"); return }

        return node.cables[index];
    }

    setDatumState(socket: Socket, state: State) {
        let datum = this.getCable(socket);
        if (!datum) return;
        datum.setState(state);
    }

    /**
     * This looks werid, but for graph processes, we want the ID of the 'cables' at our output
     * Since the refactor, the cables are identified as the hash of the node, joined by the index of the output
     * NOTE THE CONFUSING BIT: this has nothing to do with the `this.output` socket lists. 
     */
    getCablesAtOutputs(node: GeonNode) : Cable[] {
        return node.cables;
    }

    /**
     * Get a stringified version of all 'cables' the input sockets are pointing to.
     * NOTE THE CONFUSING BIT: these DO involve the this.input values 
     */
    getCablesAtInputs(node: GeonNode) : (Cable | undefined)[] {
        return node.inputs.map(connections => connections ? this.getCable(connections) : undefined);
    }

    //////////////////////////////////// Nodes /////////////////////////////////////

    addNode(node: GeonNode) {
        this.nodes.set(node.hash, node);
        if (node.core instanceof Widget) {
            this.widgets.add(node.hash);
            node.widget!.setOnChangeCallback((w) => this.onWidgetChange(node.hash, w));
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
        if (node.core instanceof Widget) {
            node.core.onDestroy();
            node.widget!.setOnChangeCallback(undefined);
            this.widgets.delete(hash);
            // TODO remove the widget itself??
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
        for (let socket of list) {
            if (socket.equals(foreign)) return true
        }
        return false;
    }

    addOutputConnectionsAt(local: Socket, foreign: Socket) {
        if (local.side != SocketSide.Output) throw new Error("NOPE");
        let outputs = this.nodes.get(local.hash)!.outputs[local.normalIndex()];
        if (outputs.some((o)=> o.equals(foreign))) throw new Error("EXISTS");
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
        let op = node.core;
        // if (!op) {
        //     return TypeShim.new("widget-param", Type.any);
        // }

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
     * Assumes the order
     */
    isConnectionValid(from: Socket, to: Socket) {
        let fromParam = this.getParameterAt(from)!;
        let toParam = this.getParameterAt(to)!;
        // let listLikeFit = TypeChecking.doTypesFitDisregardingLists(fromParam, toParam);
        let fit = fromParam?.isAcceptableType(toParam);
        // if (listLikeFit && !fit) {
        //     // this means the types fit if we enable iteration
        //     // console.log("DO A CONVERTION");
        //     // let hostnode = this.nodes.get(to.hash)!
        //     // hostnode.iterateMode = true;
        // }
        return fit;
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
        this.removeInputConnections(node);
        this.removeOutputConnections(node);
    }

    removeInputConnections(node: GeonNode) {
        for (let i = 0 ; i < node.core.inCount; i++) {
            let foreign = node.inputs[i];
            if (!foreign) continue;
            let local = Socket.fromNode(node.hash, i, SocketSide.Input);
            
            // remove foreign connection, then my connection
            this.removeOutputConnectionAt(foreign, local);
            this.setInputConnectionAt(local, undefined);
        }
    }

    removeOutputConnections(node: GeonNode) {
        for (let i = 0 ; i < node.core.outCount; i++) {
            let foreigns = node.outputs[i];
            if (!foreigns) continue;
            let local = Socket.fromNode(node.hash, i, SocketSide.Output);
            
            // remove foreign connection, then my connection
            for (let foreign of foreigns) this.setInputConnectionAt(foreign, undefined)
            this.setOutputConnectionsAt(local, []);
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
            // return false;
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
            // console.log("WARNING- REMOVING SOME OTHER CONNECTION TO ALLOW THIS ONE!");
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
            if (connections.length == 0) return;
            for (let con of connections) {
                if (!overrideOutputConnections && this.hasInputConnectionAt(con)) return;
                this.setInputConnectionAt(con, s);
            }
        });
    }

    areConnectionsCorrect() : boolean {
        
        for (let [hash, node] of this.nodes) {

            let correct = true;

            node.forEachInputSocket((socket, con) => {
                if (con == undefined) return;
                if (!this.hasOutputConnectionAt(con, socket)) {
                    console.warn(`${{socket, con}}, "is not mutual! ${this.getOutputConnectionsAt(con)} instead...`);
                    correct = false;
                }
            });
            
            node.forEachOutputSocket((socket, cons) => {
                if (cons.length == 0) return;
                for (let con of cons) {
                    if (!this.hasInputConnectionAt(con) || 
                        !this.getInputConnectionAt(con)!.equals(socket)) {
                        console.warn(`${{socket, connection: con}}, "is not mutual! ${this.getInputConnectionAt(con)} instead...`);
                        correct = false;
                    }
                }
            });
            
            if (!correct) return false;
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
            console.log(" L name: ", node.core.name);
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


function setNodeToWidgetInOuts(graph: NodesGraph, node: GeonNode, widget: Widget) {
        // a widget has just been edited internally
    // make sure the data between widget & parameters still matches 
    if (widget.outCount != node.outputs.length) {
        
        // for now, reset all
        node.resetCables();
        graph.removeOutputConnections(node);
        node.outputs = [];
        for (let output of widget.outs) {
            node.outputs.push([]);
            node.cables.push(Cable.new(output))
        }
    } 

    if (widget.inCount != node.inputs.length) {
        console.log("inputs changed!!!!");
        graph.removeInputConnections(node)
    }
}