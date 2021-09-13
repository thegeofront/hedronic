import { Vector2 } from "../../../engine/src/lib";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";

export abstract class GraphAction {
    abstract do(graph: NodesGraph): void;
    abstract undo(graph: NodesGraph): void;
}

export class GraphMoveNodeAction implements GraphAction {
    
    constructor(
        public nodes: string[],
        public from: Vector2,
        public to: Vector2,
    ) {}

    do(graph: NodesGraph) {
        
    }
    
    undo(graph: NodesGraph) {

    }
}

export class GraphAddNodeAction implements GraphAction {
    
    constructor(
        public node: GeonNode,
    ) {}

    do(graph: NodesGraph) {

    }
    
    undo(graph: NodesGraph) {

    }
}

export class GraphDeleteNodeAction implements GraphAction {
    
    constructor(
        public from: Vector2,
        public to: Vector2,
    ) {}

    do(graph: NodesGraph) {

    }
    
    undo(graph: NodesGraph) {

    }
}
