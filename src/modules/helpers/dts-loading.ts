

import * as ts from "typescript";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { IO } from "../../nodes-canvas/util/io";
import { FunctionShim } from "../shims/function-shim";
import { Type, VariableShim } from "../shims/variable-shim";

export namespace DTSHelpers {

    export function forEachRecursiveNode(root: ts.Node, callback: (node: ts.Node) => void) {
        
        let recurse = (child: ts.Node) => {
            callback(child)
            ts.forEachChild(child, recurse);
        };

        ts.forEachChild(root, recurse);
    }

    export function trueForAnyChild(node: ts.Node, predicate: (node: ts.Node) => boolean) {
        ts.forEachChild(node, (child) => {
            if (predicate(child)) {
                return true;
            }
        })
        return false;
    }

    export function getKind(node: ts.Node) {
        return ts.SyntaxKind[node.kind];
    }
}

export namespace DTSLoading {

    export async function load(codePath: string, options: any) {
            
        let code = await IO.fetchText(codePath);
        let source = ts.createSourceFile(codePath,code, ts.ScriptTarget.Latest);

        // let checker = program.getTypeChecker();
        // let sourceNode = program.getSourceFiles()[1];

        return source;
    }

    function convertToShims(source: ts.Node) {
        extractTypeShims(source);
        // extractFunctionShims(source);
    }

    function extractTypeShims(source: ts.Node) {
        DTSHelpers.forEachRecursiveNode(source, (node) => {
            if (ts.isTypeNode(node)) {
                // debug
                console.log(DTSHelpers.getKind(node));

                // here we are !                
            }

        });
    }

    function extractRelevantInfoTree(source: ts.Node) {
        
        const tree = {};

        let setTreeItem = (keys: string[], item: any) => {
            let cursor = tree;
            for (let i = 0 ; i < keys.length -1; i++) {

                //@ts-ignore
                cursor = cursor[keys[i]];
            }

            //@ts-ignore
            cursor[keys[keys.length -1]] = item;
        }

        // setTreeItem(["kaas"], "henk")
        // console.log(tree);

        let keys: string[] = [];

        let visit = (node: ts.Node) => {
            let key = ts.SyntaxKind[node.kind];
            keys.push(key)
            setTreeItem(keys, new Object())
            ts.forEachChild(node, visit)
            keys.pop();
        }

        ts.forEachChild(source, visit);

        return tree;
    } 


    export function extractFunctionShims(source: ts.Node, moduleName: string, jsModule: any) {
        
        let shims: FunctionShim[] = [];

        DTSHelpers.forEachRecursiveNode(source, (node) => {
            if (!ts.isFunctionLike(node)) return;
            if (node.kind == ts.SyntaxKind.Constructor) return;
            if (node.kind == ts.SyntaxKind.MethodDeclaration) return;
            if (!node.name) return;

            // get name and invoke
            //@ts-ignore
            let name = node.name.escapedText;
            let path = [moduleName, name];
            
            let inputs = node.parameters.map((input) => {
                let inputName = "";
                let typeNode: ts.TypeNode | undefined;
                input.forEachChild((i) => {
                    if (ts.isIdentifier(i)) {
                        inputName = i.text;
                    } else if (ts.isTypeNode(i)) {
                        typeNode = i;
                    }
                })    
                if (typeNode == undefined) {
                    throw new Error("this is weird");
                } 
                return convertTypeToVariableShim(inputName, typeNode);
            });
            
            let outputs: VariableShim[] = []; 
            if (ts.isTupleTypeNode(node.type!)) {
                let tuple = node.type as ts.TupleTypeNode;
                for (let i = 0; i < tuple.elements.length; i++) {
                    outputs.push(convertTypeToVariableShim(`Result ${i}`, tuple.elements[i]))
                }
            } else {
                outputs.push(convertTypeToVariableShim("Result", node.type!))
            }

            let shim = new FunctionShim(name, path, jsModule[name], inputs, outputs);
            shims.push(shim);
        })

        return shims;
    }

    function convertTypeToVariableShim(name: string, node: ts.TypeNode) : VariableShim {
        // TODO
        return VariableShim.new(name, Type.any);
    }

    function visitType(node: ts.Node) {
        
    }

    function visitNode(node: ts.Node, level=0) {
        
        if (node.kind == ts.SyntaxKind.FunctionDeclaration) return readFunction(node);
        console.log(`${"--".repeat(level)} type: ${ts.SyntaxKind[node.kind]}`);
        ts.forEachChild(node, (child) => visitNode(child, level+1));
        return;
    }

    function readFunction(node: ts.Node) {
        console.log(`EXTRACT FUNCTION: ${ts.SyntaxKind[node.kind]}`);
    }
}