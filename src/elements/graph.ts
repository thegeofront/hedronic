import { Random, createGUID, createRandomGUID } from "../../../engine/src/math/random";
import { Cable } from "./cable";
import { GeonNode } from "./node";

/**
 * All nodes
 * 
 * 
 */
export type GUID = string;
export type Comp = number;

export class NodesGraph {

    private constructor(
        public nodes: Map<GUID, GeonNode>, 
        public cables: Map<GUID, Cable>) {}

    static new() {
        let nodes = new Map<GUID, GeonNode>();
        let cables = new Map<GUID, Cable>();
        return new NodesGraph(nodes, cables);
    }

    static fromHash() {
        return "TODO";
    }
    
    static fromJson() {
        return "TODO";
    }

    // node & cable management

    addNode(node: GeonNode) {
        let key = createRandomGUID();
        this.nodes.set(key, node);
        return key;
    }

    deleteNode(guid: GUID) {
        return this.nodes.delete(guid);
    }

    addCable(cable: Cable) {
        let key = createRandomGUID();
        this.cables.set(key, cable);
        return key;
    }

    deleteCable(guid: GUID) {
        return this.nodes.delete(guid);
    }

    addCableBetween(a: GUID, aComp: Comp, b: GUID, bComp: Comp) {
        this.addCable(Cable.new(a, aComp, b, bComp));
    }
}