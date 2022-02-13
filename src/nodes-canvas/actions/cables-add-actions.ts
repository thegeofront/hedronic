import { Action } from "../components/action";
import { NodesGraph } from "../components/graph";
import { GeonNode } from "../components/node";

export class CablesAddAction implements Action {

    constructor(
        public node: GeonNode,
    ) {}

    do(graph: NodesGraph) {
        
    }
    
    undo(graph: NodesGraph) {
        // graph.deleteNode()
    }
}

