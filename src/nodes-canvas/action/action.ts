import { NodesGraph } from "../graph/graph";

export abstract class Action {
    // abstract binding: string[];
    abstract do(graph: NodesGraph): void;
    abstract undo(graph: NodesGraph): void;
}