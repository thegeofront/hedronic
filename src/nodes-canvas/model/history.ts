import { Vector2 } from "../../../../engine/src/lib";
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
import { FunctionShim } from "../../modules/shims/function-shim";

export type ActionCallback = (action: Action, wasUndone: boolean) => void;

/**
 * purpose: messenger system / decoupling strategy / undo support 
 * - All state-changes of the Graph SHOULD go through this class
 * - This also makes it an excellent 
 */
export class History {
    
    readonly maxActions = 30;

    constructor(
        private graph: NodesGraph,
        private actions: Action[] = [],
        private redoActions: Action[] = [],
        private onChangeCallback?: ActionCallback) {
    }

    static new(graph: NodesGraph) {
        return new History(graph);
    }

    reset(graph: NodesGraph) {
        this.graph = graph;
        this.actions = [];
        this.redoActions = []; 
    }

    setCallback(callback: ActionCallback) {
        this.onChangeCallback = callback;
    }

    ///////////////////////////////////////////////////////////////////////////

    /**
     * Should be called whenether we change the state of the graph
     */
    do(action: Action) {
        action.do(this.graph);
        // TODO : if unsuccesful: do not proceed
        if (this.onChangeCallback) this.onChangeCallback(action, false);
        return this.record(action);
    }

    /**
     * Called when we want to record a piece of history
     */
    record(action: Action) {
        // console.log("recording something")
        this.redoActions = []; // upon a new record, we must remove the redo list
        this.actions.push(action);
        this.tryTrim();
        return action;
    }

    /**
     * Ctrl + Z
     */
    undo() {
        // console.log("undoing something")
        if (this.actions.length == 0) {
            // console.log("nothing left to undo...");
            return false;
        }
        let action = this.actions.pop()!;
        action.undo(this.graph);
        if (this.onChangeCallback) this.onChangeCallback(action, true);
        this.redoActions.push(action);
        return true;
    }

    /**
     * Ctrl + Y
     */
    redo() {
        // console.log("redoing something")
        if (this.redoActions.length == 0) {
            // console.log("we cant redo anything...");
            return false;
        }
        let a = this.redoActions.pop()!;
        a.do(this.graph);
        this.actions.push(a);
        this.tryTrim();
        return true;
    }

    /**
     * Trim the lists if they start to become too long 
     */
    tryTrim() {
        if (this.actions.length > this.maxActions) {
            this.actions.splice(0, this.actions.length - this.maxActions);
        }
    }

    ///////////////////////////////////////////////////////////////////////////    

    addConnection(from: Socket, to: Socket) {
        return this.do(new CableAddAction(from, to));
    }

    removeConnection(from: Socket, to: Socket) {
        return this.do(new CableDeleteAction(from, to));
    }

    addNode(selected: FunctionShim | Widget, gp: Vector2, state?: State) : NodeAddAction {
        return this.do(new NodeAddAction(selected, gp, state)) as NodeAddAction
    }

    recordAddNodes(nodes: GeonNode[]) {
        let actions = nodes.map(node => { 
            return new NodeAddAction(node.core, node.position, node.widget?.saveState, node.hash)});
        return this.record(new MultiAction(actions))
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

