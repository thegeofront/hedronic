import { Random, createGUID, createRandomGUID } from "../../../engine/src/math/random";
import { Cable } from "./cable";
import { OpNode } from "./node";
import { Socket, SocketIdx, SocketSide } from "./socket";

/**
 * A Collection of Nodes, Gizmo's & Cables. 
 * These are doubly linked. (Nodes point to cables, cables point to nodes).
 * The Graph makes sure these links remain correct
 */
export class NodesGraph {

    private constructor(
        public nodes: Map<string, OpNode>, 
        public cables: Map<string, Cable>) {}

    static new() {
        let nodes = new Map<string, OpNode>();
        let cables = new Map<string, Cable>();
        return new NodesGraph(nodes, cables);
    }

    static fromHash() {
        throw new Error("TODO");
    }
    
    static fromJson() {
        throw new Error("TODO");
    }

    // ---- Node Management 

    addNode(node: OpNode) {
        let key = createRandomGUID();
        if (node instanceof OpNode) {
            this.nodes.set(key, node);
        }
        return key;
    }

    getNode(key: string) {
        return this.nodes.get(key);
    }

    deleteNode(nkey: string) {
        let node = this.nodes.get(nkey)!;

        // pull all connections at connectors
        for(let [idx, cable] of node.connections) {
            this.emptySocket(cable, Socket.new(nkey, idx))
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

        console.log("EMPTYING A SOCKET FROM "+ this.nodes.get(c.node)?.operation.name)
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

    addLink(a: Socket, b: Socket) {

        // before we create the cable, make sure the sockets are free
        let cable = Cable.new(a, b);

        // If a cable exist at the start of this cable, do not add a new cable.
        // but add an additional output to this one
        let existingFrom = this.getCableAtConnector(cable.from);
        if (existingFrom) {
            console.log("adding to existing...");
            for(let to of cable.to) {
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
    
    addLinkBetween(a: string, outputIndex: number, b: string, inputIndex: number) {
        let aComp: SocketIdx = outputIndex + 1;
        let bComp: SocketIdx = (inputIndex + 1) * -1;
        this.addLink(Socket.new(a,aComp), Socket.new(b, bComp));
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
            console.log(" L name: ", node.operation.name);
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