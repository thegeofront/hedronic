
// author:  Jos Feenstra
// note:    since this graph->js business is very specific and weird, I thought it best to split it away from `graph.ts`

import { NameGenerator } from "../util/alphabet";
import { NodesGraph } from "./graph";
import { WidgetSide } from "./widget";

/**
 * Create a new Graph from a js function. This function must be a pure function, and can only call other pure functions.
 */
export function jsToGraph(js: string) {
    // TODO
    return NodesGraph.new();
}

/**
 * Convert the calculation done by this graph to plain JS
 * ```js
 * 
 * fNot(a) {
 *      //
 * }
 * 
 * fOr(a, b) {
 *      //
 * }
 * 
 * fAnd(a, b) {
 *      // 
 * }
 * 
 * function(a, b) {
 *      let c = fNot(a);
 *      let d = fOr(a, b);
 *      let e = fAnd(c, d);
 *      return e;
 * }
 * 
 * ```
 * 
 */
export function graphToJs(graph: NodesGraph) {

    let js = `function() {

    }`;

    console.log("rendering html...")
    
    let orderedNodeKeys = graph.kahn();

    //start at the widgets (widget keys are the same as the corresponding node)
    for (let key of orderedNodeKeys) {

        let node = graph.getNode(key)!;

        // calculate in several ways, depending on the node
        if (node.operation) { // A | operation -> pull cache from cables & push cache to cables
            console.log("Process: ", node.operation.func);
        } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget -> push cache to cable
            console.log("Input: ", node.widget!.name);
        } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget -> pull cache from cable
            console.log("Output: ", node.widget!.name);
        } else {
            throw new Error("should never happen");
        }
    }

    let unw = NameGenerator.new();

    let v = 0;
    console.log(v.toString(16));
    return js;
}