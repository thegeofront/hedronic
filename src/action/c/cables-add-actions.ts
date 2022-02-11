import { NodesGraph } from "../../graph/graph";
import { GeonNode } from "../../graph/node";
import { Action } from "../action";

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

