import { NodesGraph } from "../graph";
import { GeonNode } from "../node";
import { Action } from "../action";

export class CableAddAction implements Action {

    constructor(
        public node: GeonNode,
    ) {}

    do(graph: NodesGraph) {
        
    }
    
    undo(graph: NodesGraph) {
        // graph.deleteNode()
    }
}

