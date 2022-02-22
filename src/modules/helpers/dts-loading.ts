

import * as ts from "typescript";
import { BillboardShader } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { IO } from "../../nodes-canvas/util/io";
import { FunctionShim } from "../shims/function-shim";
import { Type, ParameterShim } from "../shims/parameter-shim";

namespace Help {

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

    export function getNameAndType(node: ts.TypeLiteralNode) {
        
        console.log(node)
        // ts.forEachChild(node, (child) => {
        //     console.log(child);
        // })
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
        Help.forEachRecursiveNode(source, (node) => {
            if (ts.isTypeNode(node)) {
                // debug
                console.log(Help.getKind(node));

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

        Help.forEachRecursiveNode(source, (node) => {
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
                return convertTypeToParameterShim(inputName, typeNode);
            });
            
            let outputs: ParameterShim[] = []; 
            if (ts.isTupleTypeNode(node.type!)) {
                let tuple = node.type as ts.TupleTypeNode;
                for (let i = 0; i < tuple.elements.length; i++) {
                    outputs.push(convertTypeToParameterShim(`Result ${i}`, tuple.elements[i]))
                }
            } else {
                outputs.push(convertTypeToParameterShim("Result", node.type!))
            }

            let shim = new FunctionShim(name, path, jsModule[name], inputs, outputs);
            shims.push(shim);
        })

        return shims;
    }

    function convertTypeToParameterShim(name: string, node: ts.TypeNode) : ParameterShim {
        
        // 'base' types 
        switch (node.kind) {
            case ts.SyntaxKind.AnyKeyword: return ParameterShim.new(name, Type.any);
            case ts.SyntaxKind.BooleanKeyword: return ParameterShim.new(name, Type.boolean);
            case ts.SyntaxKind.NumberKeyword: return ParameterShim.new(name, Type.number);
            case ts.SyntaxKind.StringKeyword: return ParameterShim.new(name, Type.string);
        } 

        // list type 
        if (ts.isArrayTypeNode(node)) {
            let subs = [convertTypeToParameterShim("item", node.elementType)]
            return ParameterShim.new(name, Type.List, undefined, subs);
        } 
        
        // union type
        if (ts.isUnionTypeNode(node)) {
            let subs = node.types.map((child, i) => convertTypeToParameterShim(`option ${i}`, child));
            return ParameterShim.new(name, Type.Union, undefined, subs);
        }
        
        // literal object type 
        if (ts.isTypeLiteralNode(node)) {
            let subs = node.members.map((element) => {
                
                // This is kind of strange... dont know why ts does not recognise the data. Disconnect between data & header?
                // @ts-ignore 
                let elementName: string = element.name.escapedText;
                // @ts-ignore
                let elementType: ts.TypeNode = element.type;

                return convertTypeToParameterShim(elementName, elementType);
            });
            return ParameterShim.new(name, Type.Object, undefined, subs);
        }

        // non-literal object type


        console.warn("unregognised type: ", Help.getKind(node));
        return ParameterShim.new(name, Type.any);
    }
}