import { Vector2 } from "../../../../engine/src/lib";
import { Action } from "../components/action";
import { Blueprint } from "../blueprints/blueprint";
import { NodesGraph } from "../components/graph";
import { GeonNode } from "../components/node";
import { State } from "../components/state";
import { Widget } from "../components/widget";

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