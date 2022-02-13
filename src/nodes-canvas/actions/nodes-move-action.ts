import { Vector2 } from "../../../../engine/src/lib";
import { Action } from "../graph/action";
import { NodesGraph } from "../graph/graph";

export class NodesMoveAction implements Action {
    
    constructor(
        public nodes: string[],
        public delta: Vector2,
    ) {}

    do(graph: NodesGraph) {
        for (let node of this.nodes) {
            let geonNode = graph.nodes.get(node);
            geonNode?.position.add(this.delta);
        }
    }
    
    undo(graph: NodesGraph) {
        for (let node of this.nodes) {
            let geonNode = graph.nodes.get(node);
            geonNode!.position.sub(this.delta);
        }
    }
}