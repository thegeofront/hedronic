import { GeonMath } from "../../../../engine/src/lib";
import { JsType } from "../../modules/types/type";
import { TypeConvertion as TypeConversion } from "../../modules/types/type-convertion";
import { Cable, CableStyle } from "../model/cable";
import { CoreType } from "../model/core";
import { NodesGraph } from "../model/graph";
import { GeonNode, NODE_WIDTH } from "../model/node";
import { Socket } from "../model/socket";
import { State } from "../model/state";
import { WidgetSide } from "../model/widget";

export namespace GraphCalculation {

    /**
     * If a node becomes outdated: propagate this flag to all cables & nodes dependent on this node
     */
    export function flagOutdatedCables(graph: NodesGraph, starterKeys: string[]) {
        // TODO
        let keys: string[] = [];
        keys.push(...starterKeys);
        let visited = new Set();
        let n = 0;
        
        while (keys.length > 0) {
            // basic traversal stuff
            let key = keys.pop()!;
            visited.add(key);

            let node = graph.getNode(key)!;

            // set all output cables as outdated
            let outs = graph.getCablesAtOutputs(node);
            for (let out of outs) {
                out.flagAsOutdated();
                n += 1;
            }

            // add all output-connected nodes to the stack
            node?.forEachOutputSocket((_, connections) => {
                for (let connection of connections) {
                    if (visited.has(connection.hash)) continue;
                    keys.push(connection.hash);
                }
            })
        }

        return n;
    }

    /**
     * Calculate the entire graph:
     * - start with the data from input widgets
     * - calculate all operations 
     * - store results in output widgets & datums
     */
    export async function calculate(graph: NodesGraph, starterNodes?: string[]) : Promise<boolean> {

        // get starter nodes 
        let S: string[]; 
        if (!starterNodes) {
            S = getGlobalGraphStarters(graph);
        } else {
            S = starterNodes;
        }
        
        // flag certain cables as 'potentially outdated' 
        let flags = flagOutdatedCables(graph, S);
        
        // warning: kahn consumes S & starterNodes.
        let orderedNodeKeys = GraphCalculation.kahn(graph, S);
        
        // debug
        // if (starterNodes) {
        //     console.log("flagged", flags, "cables.");
        //     console.log("specific starter node called");
        //     console.log("nodekeys: ", orderedNodeKeys);
        // }

        for (let key of orderedNodeKeys) {
    
            let node = graph.getNode(key)!;
            let maybeInds = graph.getCablesAtInputs(node);
            let ins: Cable[] = [];
            for (let [i, inCable] of maybeInds.entries()) {
                if (!inCable || inCable._state == undefined) {
                    console.error("running a script with undefined data...");
                } else {
                    ins.push(inCable);
                }
            }
            let outs = graph.getCablesAtOutputs(node);
            
            // fire a 'before run' event. some widgets require it
            if (node.widget) node.widget.onBeforeRun();

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
        
        const startTime = performance.now();

        let inStates = ins.map(c => c.getState());

        let rawOutputs = [];

        try {
            //TODO RUN RUN RUN
            rawOutputs = await doRun(node, inStates);
            node.errorState = "";
        } catch(e) {
            let error = e as Error;
            return error.message;
        }
    
        // set the cables
        if (node.core.outCount == 1 && outs.length == 1) {
            outs[0].setState(rawOutputs);
        } else {
            for (let i = 0 ; i < outs.length; i++) {
                outs[i].setState(rawOutputs[i]);
            }
        } 
        
        // set some state
        const endTime = performance.now();
        node.runtime = GeonMath.round(endTime - startTime, 3);

        return undefined;
    }

    export async function calculateNodeIteratively(node: GeonNode, ins: Cable[], outs: Cable[]) {

        // prepare stopwatch
        const startTime = performance.now();

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
            if (inCable.type.type == JsType.List) {
                
                let arr = inCable.getState() as Array<any>;
                if (arr.length > count) {
                    count = arr.length;
                }
                // TODO make a more predictable iterator
                iterators.push((n: number) => {return arr[n % arr.length]})
            } else {
                iterators.push(() => {return inCable.getState()})
            }
        }

        // do the actual iteration!
        for (let i = 0 ; i < count; i++) {

            let rawInputs = iterators.map(getter => getter(i));
            let rawOutputs;
            try {
                rawOutputs = await doRun(node, rawInputs);
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
        const endTime = performance.now();
        node.loops = count;
        node.runtime = GeonMath.round(endTime - startTime, 3);

        return undefined;
    }

    async function doRun(node: GeonNode, rawInputs: any[]) {

        // do the type checking, auto-convert if needed
        // or dont, this makes everything very slow...
        for (let i = 0 ; i < rawInputs.length; i++) {
            // let inType = node.core.ins[i];
            // rawInputs[i] = TypeConversion.tryConvertTo(rawInputs[i], inType.type);
        }

        let rawOutputs = await node.core.run(...rawInputs);
        return rawOutputs;
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
    export function kahn(graph: NodesGraph, starterNodes: string[], useOutdatedState = true) {
        // fill starting lists
        let L: string[] = [];
        let S = starterNodes;
        let visitedCables: Set<string> = new Set<string>();

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
                    let node = graph.getNode(m)!
                    let cables = graph.getCablesAtInputs(node);
                    let inputs = node.inputs;

                    for (let i = 0; i < cables.length; i++) {

                        let cable = cables[i];
                        let inputSocket = inputs[i];

                        let socketKey = inputSocket ? inputSocket?.toString() : "";
                        if (!visitedCables.has(socketKey)) {

                            // don't count non-outdated cables as having 'no state';
                            if (useOutdatedState && cable && !cable._outdated) {
                                continue;
                            } 

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