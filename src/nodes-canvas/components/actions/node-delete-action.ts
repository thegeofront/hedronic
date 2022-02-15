import { Vector2 } from "../../../../../engine/src/lib";
import { Blueprint } from "../../blueprints/blueprint";
import { NodesGraph } from "../graph";
import { GeonNode } from "../node";
import { Widget } from "../widget";
import { Action } from "../action";
import { SocketIdx } from "../socket";

export class NodeDeleteAction implements Action {

    // TODO: why not just store the GeonNode's themselves? 
    private blueprints!: (Blueprint | Widget);
    private gridPositions!: Vector2;
    private connections!: Map<SocketIdx, string>;

    constructor(
        private key: string,
    ) {}

    do(graph: NodesGraph) {
        let node = graph.getNode(this.key)!;
        this.blueprints = node.core;
        this.gridPositions = node.position;
        this.connections = node.connections;
        graph.deleteNode(this.key);
    }
    
    undo(graph: NodesGraph) {
        graph.addNode(GeonNode.new(this.gridPositions, this.blueprints), this.key);
        graph.reinstateConnections(this.key, this.connections);
    }
}
