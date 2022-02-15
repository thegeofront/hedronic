import { Vector2 } from "../../../../../engine/src/lib";
import { NodesGraph } from "../graph";
import { Action } from "../action";

export class NodeMoveAction implements Action {
    
    constructor(
        public node: string,
        public delta: Vector2,
    ) {}

    do(graph: NodesGraph) {
        let geonNode = graph.nodes.get(this.node);
        geonNode?.position.add(this.delta);
    }
    
    undo(graph: NodesGraph) {
        let geonNode = graph.nodes.get(this.node);
        geonNode!.position.sub(this.delta);
    }
}