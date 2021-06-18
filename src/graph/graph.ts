import { Random, createGUID, createRandomGUID } from "../../../engine/src/math/random";
import { Cable } from "./cable";
import { GeonNode } from "./node";
import { Socket, SocketIdx } from "./socket";

/**
 * A Collection of Nodes & Cables. 
 * These are doubly linked. (Nodes point to cables, cables point to nodes).
 * The Graph makes sure these links remain correct
 */
export class NodesGraph {

    private constructor(
        public nodes: Map<string, GeonNode>, 
        public cables: Map<string, Cable>) {}

    static new() {
        let nodes = new Map<string, GeonNode>();
        let cables = new Map<string, Cable>();
        return new NodesGraph(nodes, cables);
    }

    static fromHash() {
        return "TODO";
    }
    
    static fromJson() {
        return "TODO";
    }

    // ---- Node Management 

    addNode(node: GeonNode) {
        let key = createRandomGUID();
        this.nodes.set(key, node);
        return key;
    }

    getNode(key: string) {
        return this.nodes.get(key);
    }

    deleteNode(nkey: string) {
        let node = this.nodes.get(nkey)!;

        // pull all connections at connectors
        for(let [idx, cable] of node.connections) {
            this.pullCable(cable, Socket.new(nkey, idx))
        }
        return this.nodes.delete(nkey);
    }

    getCable(key: string) {
        return this.cables.get(key);
    }

    plugCable(ckey: string, c: Socket) {
        console.log("PLUG")
        let cable = this.cables.get(ckey)!;
        
        // remove existing connections
        if (c.idx < 0) {
            // add an output
            
        } else if (c.idx > 0) {
            // move the input
            // this.getNode(cable.from.node)!.connections.delete(c.idx);
            // cable.from = c;
        }

        // add the new connection
        this.setNodeCableConnection(ckey, c);
    }

    pullCable(ckey: string, c: Socket) {

        // if connection is input, delete the entire cable
        console.log("PULLING OUT FROM "+ this.nodes.get(c.node)?.operation.name)
        if (c.idx < -1) {
            
        }


        // let success = this.cables.delete(ckey);
        // if (!success) {
        //     return false;
        // } 


        return true;
    }

    // ---- Cable Management

    addConnection(a: Socket, b: Socket) {

        // before we create the cable, make sure the sockets are free
        let cable = Cable.new(a, b);

        // If a cable is plugged in at 'to', remove it
        for (let to of cable.to) {
            let existingTo = this.getCableAtConnector(to);
            
            if (existingTo) {
                this.pullCable(existingTo, to);
            }
        }

        // if we have a cable at the input, do not create a new cable, 
        // and instead, add 'to' destinations to the existing cable
        let existingFrom = this.getCableAtConnector(cable.from);
        if (existingFrom) {
            console.log("adding to existing...");
            for(let to of cable.to) {
                this.plugCable(existingFrom, to);
            }
            return existingFrom;
        } 

        // add the actual cable, floating in the air as it were.
        let cableKey = createRandomGUID();
        this.cables.set(cableKey, cable);

        // now plug it in
        this.plugCable(cableKey, cable.from);
        for (let to of cable.to) {
            this.plugCable(cableKey, to);
        }
        return cableKey;
    }
    
    addConnectionBetween(a: string, outputIndex: number, b: string, inputIndex: number) {
        let aComp: SocketIdx = outputIndex + 1;
        let bComp: SocketIdx = (inputIndex + 1) * -1;
        this.addConnection(Socket.new(a,aComp), Socket.new(b, bComp));
    }

    // ---- Connection Management

    getCableAtConnector(c: Socket) {
        return this.nodes.get(c.node)?.connections.get(c.idx);
    }

    setNodeCableConnection(ckey: string, c: Socket) {
        let cable = this.cables.get(ckey)!;
        let node = this.nodes.get(c.node)!;
        if (c.idx < 0) {
            // input of node | 'to' / B of cable
            cable.to.add(c);
            node.connections.set(c.idx, ckey);
        } else if (c.idx > 1) {
            // output of node | 'from' / A of cable
            cable.from = c;
            node.connections.set(c.idx, ckey);
        }
    }

    removeNodeConnection(c: Socket) {
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
            console.log(" L from :", cable.from);
            console.log(" L to   :");
            for (let to of cable.to) {
                console.log("   L ", to);
            }
        }
    }
}