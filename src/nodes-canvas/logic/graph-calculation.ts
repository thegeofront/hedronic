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
     * - store results in output widgets & datums
     */
    export async function full(graph: NodesGraph) : Promise<boolean> {

        let orderedNodeKeys = GraphCalculation.kahn(graph);

        for (let key of orderedNodeKeys) {
    
            let node = graph.getNode(key)!;
            let inData = graph.getDataAtInput(node);
            let outData = graph.getDataAtOutput(node);
            let inStates = [];
            for (let datum of inData) {
                if (!datum || datum.state == undefined) {
                    console.error("running a script with undefined data...");
                    inStates.push(false);
                } else {
                    inStates.push(datum.state);
                }
            }

            let outputStates;
            try {
                //TODO RUN RUN RUN
                outputStates = await node.core.run(inStates);

            } catch(e) {
                let error = e as Error;
                node.errorState = error.message;
                console.warn("NODE-ERROR: \n", node.errorState);
                continue;
            }

            // set the cables
            if (node.core.outCount == 1) {
                outData[0].setState(outputStates);
            } else {
                for (let i = 0 ; i < outData.length; i++) {
                    outData[i].setState(outputStates[i]);
                }
            } 
        }

        return true;
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
                    for (let c of graph.getNode(m)!.getSocketKeysAtInput()) {
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