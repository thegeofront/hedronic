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
        public delta: Vector2,
    ) {}

    do(graph: NodesGraph) {
        for (let node of this.nodes) {
            let geonNode = graph.nodes.get(node);
            geonNode?.position.add(this.delta);
        }
    }
    
    undo(graph: NodesGraph) {
        for (let node of this.nodes) {
            console.log(node);
            let geonNode = graph.nodes.get(node);
            console.log(geonNode);
            geonNode!.position.sub(this.delta);
        }
    }
}

export class GraphAddNodeAction implements GraphAction {
    
    constructor(
        public node: GeonNode,
    ) {}

    do(graph: NodesGraph) {
        
    }
    
    undo(graph: NodesGraph) {
        // graph.deleteNode()
    }
}

export class GraphAddCableAction implements GraphAction {
    
    constructor(
        public node: GeonNode,
    ) {}

    do(graph: NodesGraph) {
        
    }
    
    undo(graph: NodesGraph) {
        // graph.deleteNode()
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
