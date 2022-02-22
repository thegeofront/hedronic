

import * as ts from "typescript";
import { BillboardShader, Debug } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { IO } from "../../nodes-canvas/util/io";
import { FunctionShim } from "../shims/function-shim";
import { Type, TypeShim } from "../shims/parameter-shim";

namespace Help {

    export function forEachRecursiveNode(root: ts.Node, callback: (node: ts.Node) => void) {
        
        let level = 0;
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

    /**
     * Catch all declared types, and convert them to a type format we can use
     */
    export function extractTypeDeclarations(source: ts.Node) {
        
        let namedTypes: TypeShim[] = [];

        Help.forEachRecursiveNode(source, (node) => {

            if (ts.isClassDeclaration(node)) {
                Debug.info("FOUND A CLASS");
            }

            if (ts.isInterfaceDeclaration(node)) {
                Debug.info("FOUND AN INTERFACE");
            }

            if (ts.isTypeAliasDeclaration(node)) {
                Debug.info("FOUND A TYPE ALIAS");
            }
        });

        return namedTypes;
    }


    export function extractFunctionShims(source: ts.Node, moduleName: string, jsModule: any, typeReferences: Map<string, TypeShim>) {
        
        let shims: FunctionShim[] = [];

        Help.forEachRecursiveNode(source, (node) => {
            if (!ts.isFunctionLike(node)) return;

            // TODO implement constructors once typeReferences are done 
            if (node.kind == ts.SyntaxKind.Constructor) return;

            // TODO implement methods once typeReferences are done
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
                return convertTypeToParameterShim(inputName, typeNode, typeReferences);
            });
            
            let outputs: TypeShim[] = []; 
            if (ts.isTupleTypeNode(node.type!)) {
                let tuple = node.type as ts.TupleTypeNode;
                for (let i = 0; i < tuple.elements.length; i++) {
                    outputs.push(convertTypeToParameterShim(`Result ${i}`, tuple.elements[i], typeReferences))
                }
            } else {
                outputs.push(convertTypeToParameterShim("Result", node.type!, typeReferences))
            }

            let shim = new FunctionShim(name, path, jsModule[name], inputs, outputs);
            shims.push(shim);
        })

        return shims;
    }

    function convertTypeToParameterShim(name: string, node: ts.TypeNode, typeReferences: Map<string, TypeShim>) : TypeShim {
        
        // 'base' types 
        switch (node.kind) {
            case ts.SyntaxKind.AnyKeyword: return TypeShim.new(name, Type.any);
            case ts.SyntaxKind.BooleanKeyword: return TypeShim.new(name, Type.boolean);
            case ts.SyntaxKind.NumberKeyword: return TypeShim.new(name, Type.number);
            case ts.SyntaxKind.StringKeyword: return TypeShim.new(name, Type.string);
        } 

        // list type 
        if (ts.isArrayTypeNode(node)) {
            let subs = [convertTypeToParameterShim("item", node.elementType, typeReferences)]
            return TypeShim.new(name, Type.List, undefined, subs);
        } 
        
        // union type
        if (ts.isUnionTypeNode(node)) {
            let subs = node.types.map((child, i) => convertTypeToParameterShim(`option ${i}`, child, typeReferences));
            return TypeShim.new(name, Type.Union, undefined, subs);
        }
        
        // literal object type 
        if (ts.isTypeLiteralNode(node)) {
            let subs = node.members.map((element) => {
                
                // This is kind of strange... dont know why ts does not recognise the data. Disconnect between data & header?
                // @ts-ignore 
                let elementName: string = element.name.escapedText;
                // @ts-ignore
                let elementType: ts.TypeNode = element.type;

                return convertTypeToParameterShim(elementName, elementType, typeReferences);
            });
            return TypeShim.new(name, Type.Object, undefined, subs);
        }

        // referenced object type
        if (ts.isTypeReferenceNode(node)) {

            // @ts-ignore
            let typeName = node.typeName.escapedText;

            // look up if the reference matches previously defined types
            if (typeReferences.has(typeName)) {
                return TypeShim.new(name, Type.Reference, undefined, [typeReferences.get(typeName)!]);
            } else {
                console.warn("could not find referenced type described by", typeName);
                return TypeShim.new(name, Type.any);
            }
        }

        console.warn("type not implemented: ", Help.getKind(node));
        return TypeShim.new(name, Type.any);
    }
}