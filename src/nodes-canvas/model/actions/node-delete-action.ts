import { Vector2 } from "../../../../../engine/src/lib";
import { Blueprint } from "../../blueprints/blueprint";
import { NodesGraph } from "../graph";
import { GeonNode } from "../node";
import { Widget } from "../widget";
import { Action } from "../action";
import { Socket, SocketIdx } from "../socket";

export class NodeDeleteAction implements Action {

    // TODO: why not just store the GeonNode's themselves? 
    private data!: any;
    private process!: Blueprint | Widget

    constructor(
        private key: string,
    ) {}

    do(graph: NodesGraph) {
        let node = graph.getNode(this.key)!;
        this.data = node.toJson()
        this.process = node.process;
        graph.deleteNode(this.key);
    }
    
    undo(graph: NodesGraph) {

        let node = GeonNode.fromJson(this.data, this.process)!;
        graph.addNode(node);
        // graph.reinstateConnections(this.key, this.connections);
    }
}
