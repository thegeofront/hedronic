// author:  Jos Feenstra
// note:    since this graph->js business is very specific and weird, I thought it best to split it away from `graph.ts`

import { Casing, Permutator } from "../util/permutator";
import { NodesGraph } from "./graph";
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
export function graphToJs(graph: NodesGraph) {

    let js = `function() {

    }`;

    console.log("rendering html...")
    
    let orderedNodeKeys = graph.kahn();

    let lowernames = Permutator.newAlphabetPermutator(Casing.lower);
    let uppernames = Permutator.newAlphabetPermutator(Casing.upper);

    //start at the widgets (widget keys are the same as the corresponding node)
    for (let key of orderedNodeKeys) {

        let node = graph.getNode(key)!;

        // calculate in several ways, depending on the node
        if (node.operation) { // A | operation -> pull cache from cables & push cache to cables
            console.log("pros: ", uppernames.next());
        } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget -> push cache to cable
            console.log("Input: ", lowernames.next());
            
        } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget -> pull cache from cable
            console.log("output: ", lowernames.next());
        } else {
            throw new Error("should never happen");
        }
    }

    return js;
}