import { Vector2 } from "../../../engine/src/lib";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Operation } from "../graph/operation";
import { Widget } from "../graph/widget";

export abstract class GraphAction {
    abstract do(graph: NodesGraph): void;
    abstract undo(graph: NodesGraph): void;
}

export class GraphMoveNodesAction implements GraphAction {
    
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
            let geonNode = graph.nodes.get(node);
            geonNode!.position.sub(this.delta);
        }
    }
}

export class GraphAddNodesAction implements GraphAction {
    
    constructor(
        public blueprint: Operation | Widget,
        public gridPosition: Vector2,
        private key = "",
    ) {}

    do(graph: NodesGraph) {
        this.key = graph.addNode(GeonNode.new(this.gridPosition, this.blueprint));
    }
    
    undo(graph: NodesGraph) {
        graph.deleteNode(this.key);
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

export class GraphDeleteNodesAction implements GraphAction {
    
    private blueprint!: Operation | Widget;
    private gridPosition!: Vector2;

    constructor(
        private key: string,
    ) {}

    do(graph: NodesGraph) {

    }
    
    undo(graph: NodesGraph) {

    }
}
