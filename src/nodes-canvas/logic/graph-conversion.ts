// author:  Jos Feenstra
// note:    since this graph->js business is very specific and weird, I thought it best to split it away from `graph.ts`

import { Vector2 } from "../../../../engine/src/lib";
import { Catalogue } from "../../modules/catalogue";
import { CoreType } from "../model/core";
import { NodesGraph } from "../model/graph";
import { GeonNode } from "../model/node";
import { Socket } from "../model/socket";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";
import { Casing, Permutator } from "../util/permutator";
import { mapToJson } from "../util/serializable";
import { GraphCalculation } from "./graph-calculation";

export namespace GraphConversion {

    export function trySpawnNode(graph: NodesGraph, catalogue: Catalogue, name: string, type: CoreType, pos: Vector2, lib = "GEON", state?: State) {
        // TODO: catalogue.name == lib;
        if (catalogue.trySelect(lib, name, type)) {
            let node = catalogue.spawn(pos)!;
            if (type == CoreType.Widget) {
                node.widget!.saveState = state!;
            }
            let key = graph.addNode(node);
            catalogue.deselect();
            return key;
        }
        console.warn({name, type, lib}, "is undefined!!");
        return undefined;
    }
    
    export function fromJSON(json: any, catalogue: Catalogue) : NodesGraph | undefined {
    
        try {
        let graph = NodesGraph.new();
        for (let hash in json.nodes) {
            let node = json.nodes[hash];
            let type: CoreType = node.type;
            
            if (type == CoreType.Widget) {
                let lib = "widgets";
                let name = node.process.name;
                
                let widget = catalogue.trySelect(lib, name, type) as Widget;
                if (!widget) {
                    console.error(`widget: ${lib}.${name}, ${type} cannot be created. The library is probably missing from this project`);
                    continue;
                }
    
                widget.saveState = node.process.state;
                widget.attach(hash);
    
                let geonNode = GeonNode.fromJson(node, widget);
                if (!geonNode) {
                    console.error(`widget: ${lib}.${name}, ${type} cannot be created. json data provided is errorous`)
                    continue;
                }
                graph.addNode(geonNode);
                continue; 
            }
    
            if (type == CoreType.Operation) {
                let lib = node.process.path[0];
                let name = node.process.name;
                
                let process = catalogue.trySelect(lib, name, type);
                if (!process) {
                    console.error(`operation process: ${lib}.${name}, ${type} cannot be created. The library is probably missing from this project`);
                    continue;
                } 
                let geonNode = GeonNode.fromJson(node, process);
                if (!geonNode) {
                    console.error(`operation process: ${lib}.${name}, ${type} cannot be created. json data provided is errorous`)
                    continue;
                }
                graph.nodes.set(hash, geonNode);  
                continue; 
            }
        }
        catalogue.deselect();
        return graph;
        } catch (e) {
            console.error("something went wrong during json parsing:");
            console.error(e);
            return undefined;
        }
    }
    
    export function toJSON(graph: NodesGraph) {
        
        let nodes = graph.nodes;
        return {
                nodes: mapToJson(nodes, GeonNode.toJson),
        }
    }
    
    
    
    /**
     * Create a new Graph from a js function. This function must be a pure function, and can only call other pure functions.
     * 
     * TODO
     * - make sure that this could work even without comments
     * 
     * subcomponents:
     * - figure out the difference between variable and function
     * - figure out which functions are called, and the content of those methods
     * - turn functions into Operations
     * - create instances of those operations, and figure out where they should be placed on the canvas
     *    - enough spacing
     *    - x based on dependency depth
     *    - y based on call order, spacing
     * 
     * - turn variables into cables, relationships 
     * - turn inputs into input variables
     * - turn output into output variables
     */
    export function fromJavascript(js: string, catalogue: Catalogue, graph = NodesGraph.new()) : NodesGraph | undefined {
        
        // NOTE: this procedure also heavely relies on regex. Not foolproof!
        let lines = js.split('\n');
        let all = lines.join("");
    
        let f = extractDeclareFunctionElements(all)!;
        if (!f) {
            return undefined;
        }
    
        let cableStarts = new Map<String, Socket>();
    
        let createCable = (key: string, nodeKey: string, idx: number) => {
            cableStarts.set(key.trim(), Socket.new(nodeKey, idx));
        }
    
        let hookupCable = (key: string, nodeKey: string, idx: number) => {
            let k = key.trim();
            if (cableStarts.has(k)) {
                let start = cableStarts.get(k)!;
                graph.addCableBetween(start.hash, start.idx, nodeKey, idx);
            }
        }
    
        // ---------
        
        for (let i = 0 ; i < f.inputs.length; i++) {
            let line = f.inputs[i];
            let l = extractComment(line)!;
            if (!l) {
                console.warn("bad input!");
                continue;
            };
            let name = l.rest;
            let json = commentToJson(l.comment);
            let state = stringToState(json.state);
            // console.log("state", state);
            let nodeKey = trySpawnNode(graph, catalogue, json.widget, CoreType.Widget, Vector2.new(json.x, json.y), "widgets", state)!;
            createCable(name, nodeKey, 0);
        }
    
        for (let i = 0 ; i < f.body.length; i++) {
            let line = f.body[i];
            let l = extractComment(line);
            if (!l) continue;
            let rest = l.rest;
            let json = commentToJson(l.comment);
            // console.log({rest, json});
            let call = extractCallFunctionElements(rest)!;
            // console.log(call.lib)
            let nodeKey = trySpawnNode(graph, catalogue, call.name, CoreType.Operation, Vector2.new(json.x, json.y), call.lib)!;
    
            for (let j = 0 ; j < call.outputs.length; j++) {
                createCable(call.outputs[j], nodeKey, j);
            }
    
            for (let j = 0 ; j < call.inputs.length; j++) {
                hookupCable(call.inputs[j], nodeKey, j);
            }
        }
    
        for (let i = 0 ; i < f.outputs.length; i++) {
            let line = f.outputs[i];
            let l = extractComment(line)!;
            if (!l) continue;
            let name = l.rest;
            let json = commentToJson(l.comment);
            let nodeKey = trySpawnNode(graph, catalogue, json.widget, CoreType.Widget, Vector2.new(json.x, json.y), "widgets")!;
            hookupCable(name, nodeKey, 0);
        }
      
        // graph.log();
    
        return graph;
    }
    
    function stringToState(stateString: string) : State {
        let s = stateString;
        if (s === "true") 
            return true;
        if (s === "false") 
            return false;
        return s;
    }
    
    function extractComment(str: string) {
        let regex = /(.*)\/\*(.*)\*\//.exec(str);
        if (!regex || regex.length != 3) {
            return undefined;
        }
        return {rest: regex[1].trim(), comment: regex[2]};
    }
    
    function commentToJson(str: string) {
        // turn it into a json
        let jsonStr = `{${str.replace(/\|/g, ",")}}`;
        return JSON.parse(jsonStr);
    }
    
    function extractCallFunctionElements(str: string) {
        let functionRegex = /let *\[(.*)\] = ([a-zA-Z0-9]*).([a-zA-Z0-9]*)\((.*)\)/;
        let res = functionRegex.exec(str);
        if (!res) return;   
        let outputs = res[1].split(',');
        let lib = res[2];
        let name = res[3];
        let inputs = res[4].split(',');
        return {inputs, lib, name, outputs};
    }
    
    function extractDeclareFunctionElements(str: string) {
    
        let functionRegex = /function (.*)\((.*)\).*\{(.*)return \[(.*)\].*\}/;
        let res = functionRegex.exec(str);
        if (!res || res.length != 5) {
            return undefined;
        }
    
        let name = res[1];
        let inputs = res[2].split(',');
        let body = res[3].split(';');
        let outputs = res[4].split(',');
    
        return {name, inputs, body, outputs}
    }
    
    /**
     * Convert the calculation done by this graph to plain JS
     */
    export function toFunction(graph: NodesGraph, name: string) : Function {
    
        console.log("rendering javascript...")
        
        let orderedNodeKeys = GraphCalculation.kahn(graph, GraphCalculation.getGlobalGraphStarters(graph));
    
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
                let inputs = toEasyNames(node.getSocketKeysAtOutput()).join(", ");
                let outputs = toEasyNames(node.getSocketKeysAtInput()).join(", ");
                let str = `let [${inputs}] = ${node.operation!.path[0]}.${node.core.name}(${outputs}) /* "x": ${node.position.x} | "y": ${node.position.y} */;`;
                processes.push(str);
            } else if (node.widget!.side == WidgetSide.Input) { // B | Input Widget
                for (let str of toEasyNames(node.getSocketKeysAtOutput())) {
                    str += ` /* "widget": "${node.widget!.name}" | "state": "${node.widget!.saveState}" | "x": ${node.position.x} | "y": ${node.position.y} */`;
                    inputs.push(str);
                }
            } else if (node.widget!.side == WidgetSide.Output) { // C | Output Widget 
                for (let str of toEasyNames(node.getSocketKeysAtInput())) {
                    str += ` /* "widget": "${node.widget?.name}" | "x": ${node.position.x} | "y": ${node.position.y} */`;
                    outputs.push(str);
                }
            } else if (node.widget!.side == WidgetSide.Process) {
                // TODO : make this 
                console.warn("I must implement this!");
            } else {
                throw new Error("should never happen");
    
            }
        }
    
        let fn = Function(...inputs, `    ${processes.join("\n    ")}
        return [${outputs.join(", ")}];`);
    
        Object.defineProperty(fn, "name", { value: name });
        // console.log(fn.toString());
        return fn;
    }
}

