import { Vector2 } from "../../../../../engine/src/lib";
import { Blueprint } from "../../blueprints/blueprint";
import { NodesGraph } from "../graph";
import { GeonNode } from "../node";
import { State } from "../state";
import { Widget } from "../widget";
import { Action } from "../action";

export class NodeAddAction implements Action {

    constructor(
        public process: Blueprint | Widget,
        public gridPosition: Vector2,
        public initState?: State,
        private key?: string,
    ) {}

    do(graph: NodesGraph) {
        let node = GeonNode.new(this.gridPosition, this.process)!;
        if (node.process instanceof Widget && this.initState) {
            node.process.state = this.initState;
        }
        this.key = graph.addNode(node, this.key);
    }
    
    undo(graph: NodesGraph) {
        graph.deleteNode(this.key!);
    }
}