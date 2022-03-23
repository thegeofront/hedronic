import { Type } from "../../modules/types/type";
import { Cable, CableStyle } from "../model/cable";
import { NodesGraph } from "../model/graph";
import { GeonNode } from "../model/node";
import { Socket } from "../model/socket";
import { State } from "../model/state";
import { WidgetSide } from "../model/widget";

export namespace GraphCalculation {

    /**
     * If a node becomes outdated: propagate this logic to all nodes dependent on this node
     */
    export async function setOutdated(key: Node) {
        // TODO
    }

    /**
     * Only calculate outdated nodes
     */
    export async function partial() {
        // TODO
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
            let maybeInds = graph.getDataAtInput(node);
            let ins: Cable[] = [];
            for (let [i, inCable] of maybeInds.entries()) {
                if (!inCable || inCable.state == undefined) {
                    console.error("running a script with undefined data...");
                    
                } else {
                    ins.push(inCable);
                }
            }
            let outs = graph.getDataAtOutput(node);
            

            let err;
            if (node.looping) {
                err = await calculateNodeIteratively(node, ins, outs);
            } else {
                err = await calculateNode(node, ins, outs);
            }

            // handle errors 
            if (err) {
                node.errorState = err;
                console.warn("NODE-ERROR: \n", node.errorState);
            } else {
                node.errorState = "";
            }
        }

        return true;
    }

    /**
     * 
     */
    export async function calculateNode(node: GeonNode, ins: Cable[], outs: Cable[]) {
        
        let inStates = ins.map(c => c.state);

        let rawReturnState = [];

        try {
            //TODO RUN RUN RUN
            rawReturnState = await node.core.run(...inStates);
            node.errorState = "";
        } catch(e) {
            let error = e as Error;
            return error.message;
        }
    
        // set the cables
        if (node.core.outCount == 1 && outs.length == 1) {
            outs[0].setState(rawReturnState);
        } else {
            for (let i = 0 ; i < outs.length; i++) {
                outs[i].setState(rawReturnState[i]);
            }
        } 
        
        return undefined;
    }

    export async function calculateNodeIteratively(node: GeonNode, ins: Cable[], outs: Cable[]) {

        // prepare to store output data
        let aggregators: State[][] = [];
        for (let [i, outCable] of outs.entries()) {
            aggregators.push([]);
        }

        // figure out how many times we need to iterate
        let count = 1;

        // construct iterators, which will iterate over all list input cables, or just return the item
        let iterators: ((count: number) => State)[] = [];
        for (let [i, inCable] of ins.entries()) {

            // TODO do a better job of detecting 'artifical' lists
            // NO: we need to do this sometimes for natural lists
            if (inCable.type.type == Type.List) {
                
                let arr = inCable.state as Array<any>;
                if (arr.length > count) {
                    count = arr.length;
                }
                // TODO make a more predictable iterator
                iterators.push((n: number) => {return arr[n % arr.length]})
            } else {
                iterators.push(() => {return inCable.state})
            }
        }

        // do the actual iteration!
        for (let i = 0 ; i < count; i++) {

            let rawInputs = iterators.map(getter => getter(i));
            let rawOutputs;
            try {
                rawOutputs = await node.core.run(...rawInputs);
                node.errorState = "";
            } catch(e) {
                let error = e as Error;
                return error.message + `\nHappened at iteration: ${i}. `;
            }

            // set to the aggregators
            if (node.core.outCount == 1 && outs.length == 1) {
                aggregators[0].push(rawOutputs);
            } else {
                for (let i = 0 ; i < outs.length; i++) {
                    aggregators[i].push(rawOutputs[i]);
                }
            } 
        }

        // set the cables
        for (let i = 0 ; i < outs.length; i++) {
            outs[i].setState(aggregators[i]);
        }     
        
        // set some info 
        node.loops = count;
        
        return undefined;
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