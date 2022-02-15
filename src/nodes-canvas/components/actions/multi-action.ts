import { NodesGraph } from "../graph";
import { GeonNode } from "../node";
import { Action } from "../action";

/**
 * Group a couple of actions together. 
 * Examples: 
 * - A 'duplicate action' (Ctrl + D) is a grouping of a copy, move and paste action. 
 * - A 'move action' on multiple nodes is a grouping of multiple move actions on different nodes
 * - A 'delete action' removes connected cables before deleting the node in question. 
 *    - Reversing will reinstate the cables
 *    - This is why the undo must be performed in reverse 
 */
export class MultiAction implements Action {

    constructor(
        public actions: Action[],
    ) {}

    do(graph: NodesGraph) {
        for (let i = 0 ; i < this.actions.length; i++) {
            this.actions[i].do(graph);
        }
    }
    
    undo(graph: NodesGraph) {
        // undo in reverse. Seems sensible
        for (let i = this.actions.length - 1; i > -1; i -= 1) {
            this.actions[i].undo(graph);
        }
    }
}

