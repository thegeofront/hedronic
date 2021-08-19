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
 * 
 * What it should look like 
 * ```js
 * 
 * function(a, b) {
 *      let c = fNot(a);
 *      let d = fOr(a, b);
 *      let e = fAnd(c, d);
 *      return e;
 * }
 * 
 * ```
 * subcomponents
 * - turn an operation into an actual function call  
 * - generate names
 * - 
 * 
 * 
 */
export function graphToFunction(graph: NodesGraph, name: string) {

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

        // calculate in several ways, depending on the node
        if (node.operation) { // A | operation -> pull cache from cables & push cache to cables
            processes.push(`[${toEasyNames(node.outputs()).join(", ")}] = GEON.${node.operation.name}(${toEasyNames(node.inputs()).join(", ")});`);
        } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget -> push cache to cable
            inputs.push(...toEasyNames(node.outputs()));
        } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget -> pull cache from cable
            outputs.push(...toEasyNames(node.inputs()));
        } else {
            throw new Error("should never happen");
        }
    }

    // finally, create everything
    //     let js = `
    // /**
    //  * note: this function was auto generated
    //  */ 
    // function (${inputs.join(", ")}) {
    //     ${processes.join("\n        ")}
    //     return [${outputs.join(", ")}];
    // }
    //     `;

    let fn = Function(...inputs, `
        ${processes.join("\n        ")}
        return [${outputs.join(", ")}];
    `);

    Object.defineProperty(fn, "name", { value: name });
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