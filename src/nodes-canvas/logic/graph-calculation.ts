import { Cable, CableStyle } from "../model/cable";
import { NodesGraph } from "../model/graph";
import { Socket } from "../model/socket";
import { State } from "../model/state";
import { WidgetSide } from "../model/widget";

export namespace GraphCalculation {

    /**
     * If a node becomes outdated: propagate this logic to all nodes dependent on this node
     */
    export async function setOutdated(key: Node) {

    }

    /**
     * Only calculate outdated nodes
     */
    export async function partial() {

    }

    /**
     * Calculate the entire graph:
     * - start with the data from input widgets
     * - calculate all operations 
     * - store results in output widgets
     * TODO: build something that can recalculate parts of the graph
     */
    export async function full(graph: NodesGraph) : Promise<Map<string, Cable>> {

        let cables = new Map<string, Cable>();
        let orderedNodeKeys = GraphCalculation.kahn(graph);

        let setValue = (key: string, value: State) => {
            // let cable = this.getOutputConnectionsAt(key)!;
            // if (!cable) {
            //     return;
            // }

            let style = CableStyle.Off;
            if (value) {
                style = CableStyle.On;
            } 
            cables.set(key, Cable.new(value, style));
        }

        //start at the widgets (widget keys are the same as the corresponding node)
        for (let key of orderedNodeKeys) {
    
            let node = graph.getNode(key)!;

            // calculate in several ways, depending on the node
            if (node.operation || node.widget?.side == WidgetSide.Process) { // A | operation -> pull cache from cables & push cache to cables
                
                let inputs = [];
                for (let cable of node.getCablesAtInput()) { // TODO multiple inputs!! ?
                    inputs.push(cables.get(cable)?.state!);
                }
                let outputs;
                try {
                    //TODO RUN RUN RUN
                    outputs = await node.core.run(inputs);
                } catch(e) {
                    let error = e as Error;
                    node.errorState = error.message;
                    console.warn("NODE-ERROR: \n", node.errorState);
                    continue;
                }

                let outCables = node.getCablesAtOutput();
                if (node.core.outCount == 1) {
                    setValue(outCables[0], outputs);
                } else {
                    for (let i = 0 ; i < node.core.outCount; i++) {
                        setValue(outCables[i], outputs[i]);
                    }
                }
                
            } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget -> push cache to cable
                for (let cable of node.getCablesAtOutput()) {
                    setValue(cable, node.widget!.state);
                }
            } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget -> pull cache from cable
                for (let cable of node.getCablesAtInput()) { // TODO multiple inputs!!
                    node.widget!.run(cables.get(cable)!.state!);
                }
            } else {
                throw new Error("should never happen");
            }
        }
        return cables;
    }

    /**
     * When doing a full recalculation: find the nodes we need to start at
     */
    export function getGlobalGraphStarters(graph: NodesGraph) {

        let S: string[] = [];

        // use the widgets to identify the starting point
        for (let key of graph.widgets) {
            let widget = graph.getNode(key)!.widget!;
            if (widget.side !== WidgetSide.Input) continue; 
            S.push(key);
        }

        // if a regular node has no inputs, its also a starter 
        for (let [key, node] of graph.nodes.entries()) {
            if (node.core.inCount !== 0) continue;
            S.push(key);
        }

        return S;
    }

    /**
     * An implementation of kahn's algorithm: 
     * https://en.wikipedia.org/wiki/Topological_sorting
     */
    export function kahn(graph: NodesGraph, starterNodes?: string[]) {
        // fill starting lists
        let L: string[] = [];
        let S: string[];
        let visitedCables: Set<string> = new Set<string>();

        if (!starterNodes) {
            S = getGlobalGraphStarters(graph);
        } else {
            S = starterNodes;
        }

        while (true) {

            let hash = S.pop();
            if (hash == undefined) 
                break;
            L.push(hash);

            let node = graph.getNode(hash)!;

            // for each node m with an edge e from n to m do
            node.forEachOutputSocket((s: Socket, connections: Socket[]) => {
                let cableHash = s.toString();
                
                // 'remove' edge e from the graph
                if (visitedCables.has(cableHash))
                    return;
                visitedCables.add(cableHash);

                // if m has no other incoming edges then
                // insert m into S
                for (let connection of connections) {
                    let m = connection.hash;
                    let allVisited = true;
                    for (let c of graph.getNode(m)!.getCablesAtInput()) {
                        if (!visitedCables.has(c)) {
                            allVisited = false;
                            break;
                        }
                    }
                    if (allVisited) {
                        S.push(m);
                    }
                }
            })
        }

        return L;
    }

}