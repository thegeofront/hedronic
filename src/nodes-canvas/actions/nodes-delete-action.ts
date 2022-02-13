import { Vector2 } from "../../../../engine/src/lib";
import { Action } from "../components/action";
import { Blueprint } from "../blueprints/blueprint";
import { NodesGraph } from "../components/graph";
import { GeonNode } from "../components/node";
import { Widget } from "../components/widget";

export class NodesDeleteAction implements Action {

    // TODO: why not just store the GeonNode's themselves? 
    private blueprints!: (Blueprint | Widget)[];
    private gridPositions!: Vector2[];
    private connections!: Map<number, string>[];

    constructor(
        private keys: string[],
    ) {}

    do(graph: NodesGraph) {
        this.blueprints = [];
        this.gridPositions = [];
        this.connections = [];
        for (let key of this.keys) {
            let node = graph.getNode(key)!;
            this.blueprints.push(node.core);
            this.gridPositions.push(node.position);
            this.connections.push(node.connections);
            graph.deleteNode(key);
        }
    }
    
    undo(graph: NodesGraph) {
        for (let i = 0 ; i < this.blueprints.length ; i++) {
            // add the node back with the exact same key it had before
            graph.addNode(GeonNode.new(this.gridPositions[i], this.blueprints[i]), this.keys[i]);
            
            for (let [idx, cable] of this.connections[i]) {
                // graph.addCable(Socket.new(this.keys[i], idx), )
            }
        }
    }
}
