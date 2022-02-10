import { Vector2 } from "../../../engine/src/lib";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Operation } from "../graph/operation";
import { Widget } from "../graph/widget";
import { GraphAction, GraphAddNodesAction, GraphMoveNodesAction } from "./graph-actions";

/**
 * purpose: messenger system / decoupling strategy / undo support 
 */
export class GraphHistory {
    
    constructor(
        private graph: NodesGraph,
        private actions: GraphAction[] = [],
        private redoActions: GraphAction[] = []) {
    }

    static new(graph: NodesGraph) {
        return new GraphHistory(graph, []);
    }

    reset(graph: NodesGraph) {
        this.graph = graph;
        this.actions = [];
        this.redoActions = []; 
    }

    doAddNode(selected: Operation | Widget, gp: Vector2) {
        return this.do(new GraphAddNodesAction(selected, gp))
    }

    doDeleteNode() {

    }

    doMove(nodes: string[], delta: Vector2) {
        return this.do(new GraphMoveNodesAction(nodes, delta));
    }

    /**
     * Store A move without doing a move
     * We need to do this if we are dragging a node around. 
     * We want to update the position continuously, but only store one 'move' event, without actually moving the object
     */
    recordMove(nodes: string[], delta: Vector2) {
        this.redoActions = [];
        return this.record(new GraphMoveNodesAction(nodes, delta))
    }

    /**
     * Should be called whenether we change the state of the graph
     */
    do(action: GraphAction) {
        console.log("doing something")
        action.do(this.graph);
        return this.record(action);
    }

    /**
     * Called when we want to record a piece of history
     */
    record(action: GraphAction) {
        console.log("recording something")
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
}

