import { Vector2 } from "../../../../engine/src/lib";
import { NodesGraph } from "../../graph/graph";
import { GeonNode } from "../../graph/node";
import { Operation } from "../../graph/operation";
import { Widget } from "../../graph/widget";
import { Action } from "../action";

export class NodesAddAction implements Action {
    
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