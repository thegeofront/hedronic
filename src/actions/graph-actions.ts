import { Vector2 } from "../../../engine/src/lib";
import { NodesGraph } from "../graph/graph";
import { GeonNode } from "../graph/node";
import { Operation } from "../graph/operation";
import { Socket } from "../graph/socket";
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
        private key?: string,
    ) {}

    do(graph: NodesGraph) {
        this.key = graph.addNode(GeonNode.new(this.gridPosition, this.blueprint), this.key);
    }
    
    undo(graph: NodesGraph) {
        graph.deleteNode(this.key!);
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

    // TODO: why not just store the GeonNode's themselves? 
    private blueprints!: (Operation | Widget)[];
    private gridPositions!: Vector2[];
    private connections!: Map<number, string>[];

    constructor(
        private keys: string[],
    ) {}

    do(graph: NodesGraph) {
        this.blueprints = [];
        this.gridPositions = [];
        this.connections = [];
        for (let key of this.keys) {
            let node = graph.getNode(key)!;
            this.blueprints.push(node.core);
            this.gridPositions.push(node.position);
            this.connections.push(node.connections);
            graph.deleteNode(key);
        }
    }
    
    undo(graph: NodesGraph) {
        for (let i = 0 ; i < this.blueprints.length ; i++) {
            // add the node back with the exact same key it had before
            graph.addNode(GeonNode.new(this.gridPositions[i], this.blueprints[i]), this.keys[i]);
            
            for (let [idx, cable] of this.connections[i]) {
                // graph.addCable(Socket.new(this.keys[i], idx), )
            }
        }
    }
}
