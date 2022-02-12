import { Vector2 } from "../../../../engine/src/lib";
import { NodesGraph } from "../../graph/graph";
import { GeonNode } from "../../graph/node";
import { Blueprint } from "../../graph/blueprint";
import { Widget } from "../../graph/widget";
import { Action } from "../action";
import { State } from "../../graph/state";

export class NodesAddAction implements Action {
    
    constructor(
        public blueprint: Blueprint | Widget,
        public gridPosition: Vector2,
        public initState?: State,
        private key?: string,
    ) {}

    do(graph: NodesGraph) {
        let node = GeonNode.new(this.gridPosition, this.blueprint);
        if (node.core instanceof Widget && this.initState) {
            node.core.state = this.initState;
        }
        this.key = graph.addNode(node, this.key);
    }
    
    undo(graph: NodesGraph) {
        graph.deleteNode(this.key!);
    }
}