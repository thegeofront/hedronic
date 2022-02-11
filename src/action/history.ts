import { Vector2 } from "../../../engine/src/lib";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Operation } from "../graph/operation";
import { Socket } from "../graph/socket";
import { Widget } from "../graph/widget";
import { Action } from "./action";
import { NodesAddAction } from "./c/nodes-add-action";
import { NodesDeleteAction } from "./c/nodes-delete-action";
import { NodesMoveAction } from "./c/nodes-move-action";

/**
 * purpose: messenger system / decoupling strategy / undo support 
 * TODO: make all actions about a single node / cable, and then add something to group actions together
 */
export class History {
    
    constructor(
        private graph: NodesGraph,
        private actions: Action[] = [],
        private redoActions: Action[] = []) {
    }

    static new(graph: NodesGraph) {
        return new History(graph, []);
    }

    reset(graph: NodesGraph) {
        this.graph = graph;
        this.actions = [];
        this.redoActions = []; 
    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Should be called whenether we change the state of the graph
     */
    do(action: Action) {
        console.log("doing something")
        action.do(this.graph);
        return this.record(action);
    }

    /**
     * Called when we want to record a piece of history
     */
    record(action: Action) {
        console.log("recording something")
        this.redoActions = [];
        this.actions.push(action);
    }

    /**
     * Ctrl + Z
     */
    undo() {
        console.log("undoing something")
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
        console.log("redoing something")
        if (this.redoActions.length == 0) {
            console.log("we cant redo anything...");
            return false;
        }
        let a = this.redoActions.pop()!;
        a.do(this.graph);
        this.actions.push(a);
        return true;
    }

    ///////////////////////////////////////////////////////////////////////////    

    addNodes(selected: Operation | Widget, gp: Vector2) {
        return this.do(new NodesAddAction(selected, gp))
    }

    deleteNodes(keys: string[]) {
        return this.do(new NodesDeleteAction(keys))
    }

    moveNodes(keys: string[], delta: Vector2) {
        return this.do(new NodesMoveAction(keys, delta));
    }

    recordMoveNodes(keys: string[], delta: Vector2) {
        return this.record(new NodesMoveAction(keys, delta))
    }
}

