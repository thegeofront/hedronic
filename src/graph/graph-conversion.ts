// author:  Jos Feenstra
// note:    since this graph->js business is very specific and weird, I thought it best to split it away from `graph.ts`

import { Catalogue } from "../operations/catalogue";
import { Casing, Permutator } from "../util/permutator";
import { NodesGraph } from "./graph";
import { GeonNode } from "./node";
import { WidgetSide } from "./widget";

/**
 * Create a new Graph from a js function. This function must be a pure function, and can only call other pure functions.
 * 
 * subcomponents:
 * - figure out the difference between variable and function
 * - figure out which functions are called, and the content of those methods
 * - turn functions into Operations
 * - create instances of those operations, and figure out where they should be placed on the canvas
 *    - enough spacing
 *    - x based on dependency depth
 *    - y based on call order, spacing
 * - turn variables into cables, relationships 
 * - turn inputs into input variables
 * - turn output into output variables
 */
export function jsToGraph(js: string) {
    
    
    // TODO
    return NodesGraph.new();
}

/**
 * Convert the calculation done by this graph to plain JS
 */
export function graphToFunction(graph: NodesGraph, name: string, namespace: string) {

    console.log("rendering html...")
    
    let orderedNodeKeys = graph.kahn();

    let inputs: string[] = [];
    let processes: string[] = [];
    let outputs: string[] = [];
    
    // this is a setup to convert the long cable hashes into names like `a`, `b`, `c`, `aa` etc. 
    let lowernames = Permutator.newAlphabetPermutator(Casing.lower);
    let mapping = new Map<string, string>(); // key -> cable key. value -> newly generated name
    let toEasyNames = (hashes: string[]) => {
        let names: string[] = [];
        for (let hash of hashes) {
            if (!mapping.has(hash)) {
                mapping.set(hash, lowernames.next());
            } 
            names.push(mapping.get(hash)!);
        }
        return names;
    }

    //start at the widgets (widget keys are the same as the corresponding node)
    for (let key of orderedNodeKeys) {

        let node = graph.getNode(key)!;
        if (node.operation) { // A | operation 
            let str = `[${toEasyNames(node.outputs()).join(", ")}] = ${namespace}.${node.operation.name}(${toEasyNames(node.inputs()).join(", ")}); /* x: ${node.position.x} | y: ${node.position.x} */`;
            processes.push(str);
        } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget
            for (let str of toEasyNames(node.outputs())) {
                str += ` /* widget: ${node.widget?.name}  x: ${node.position.x} | y: ${node.position.x} */`;
                inputs.push(str);
            }
        } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget 
            for (let str of toEasyNames(node.inputs())) {
                str += ` /* widget: ${node.widget?.name}  x: ${node.position.x} | y: ${node.position.x} */`;
                outputs.push(str);
            }
        } else {
            throw new Error("should never happen");
        }
    }

    let fn = Function(...inputs, `
        ${processes.join("\n        ")}
        return [${outputs.join(", ")}];
    `);

    Object.defineProperty(fn, "name", { value: name });
    console.log(fn.toString());
    return fn;
}

/**
 * To make sure nested operations work, we need to publish the catalogue globally. 
 */
export function makeOperationsGlobal(catalogue: Catalogue, namespace="GEON") {
    
    let space = {};
    Object.defineProperty(window, namespace, { value: space, configurable: true});

    for (let op of catalogue.operations) {
        Object.defineProperty(space, op.func.name, { value: op.func, configurable: true});
    }
}