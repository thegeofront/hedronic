import { Vector2 } from "../../../../engine/src/lib";
import { OldFunctionShim } from "../../module-loading/shims/old-function-shim";
import { NodesGraph } from "./graph";
import { GeonNode } from "./node";
import { Socket } from "./socket";
import { State } from "./state";
import { Widget } from "./widget";
import { Action } from "./action";
import { MultiAction } from "./actions/multi-action";

import { NodeAddAction } from "./actions/node-add-action";
import { NodeDeleteAction } from "./actions/node-delete-action";
import { NodeMoveAction } from "./actions/node-move-action";
import { CableAddAction } from "./actions/cable-add-action";
import { CableDeleteAction } from "./actions/cable-delete-action";

/**
 * purpose: messenger system / decoupling strategy / undo support 
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
        this.redoActions = []; // upon a new record, we must remove the redo list
        this.actions.push(action);
        console.log(this.actions)
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

    addConnection(from: Socket, to: Socket) {
        return this.do(new CableAddAction(from, to));
    }

    removeConnection(from: Socket, to: Socket) {
        return this.do(new CableDeleteAction(from, to));
    }

    addNodes(selected: OldFunctionShim | Widget, gp: Vector2, state?: State) {
        return this.do(new NodeAddAction(selected, gp, state))
    }

    deleteNodes(keys: string[]) {
        let actions = keys.map(key => new NodeDeleteAction(key));
        return this.do(new MultiAction(actions));
    }

    moveNodes(keys: string[], delta: Vector2) {
        let actions = keys.map(key => new NodeMoveAction(key, delta));
        return this.do(new MultiAction(actions));
    }

    recordMoveNodes(keys: string[], delta: Vector2) {
        let actions = keys.map(key => new NodeMoveAction(key, delta));
        return this.record(new MultiAction(actions))
    }
}

