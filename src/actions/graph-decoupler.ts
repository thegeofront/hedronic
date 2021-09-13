import { Vector2 } from "../../../engine/src/lib";
import { NodesGraph } from "../graph/graph";
import { GraphAction } from "./graph-actions";

/**
 * purpose: messenger system / decoupling strategy / undo support 
 */
export class GraphDecoupler {
    
    constructor(
        public graph: NodesGraph,
        public actions: GraphAction[] = [],
        public redoActions: GraphAction[] = []) {
    }

    static new(graph: NodesGraph) {
        return new GraphDecoupler(graph, []);
    }

    /**
     * Called whenether we change the state of the graph
     */
    do(action: GraphAction) {
        action.do(this.graph);
        this.actions.push(action);
    }

    /**
     * Ctrl + Z
     */
    undo() {
        if (this.actions.length == 0) {
            console.log("nothing left to undo...");
            return false;
        }
        let a = this.actions.pop()!;
        a.undo(this.graph);
        this.redoActions.push(a);
        return true;
    }

    /**
     * Ctrl + Y
     */
    redo() {
        if (this.redoActions.length == 0) {
            console.log("we cant redo anything...");
            return false;
        }
        let a = this.redoActions.pop()!;
        a.do(this.graph);
        this.actions.push(a);
        return true;
    }
}

