

import * as ts from "typescript";
import { BillboardShader, Debug, WebIO } from "../../../../engine/src/lib";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { IO } from "../../nodes-canvas/util/io";
import { tryApplyTraits } from "../../std/types/various/types-3";
import { FunctionShim } from "../shims/function-shim";
import { TypeShim } from "../shims/type-shim";
import { Type } from "../types/type";

namespace Help {

    export function isStatic(node: ts.Node) {
        if (!node.modifiers) return false;
        for (let mod of node.modifiers) {
            if (mod.kind == ts.SyntaxKind.StaticKeyword) return true;
        }
        return false;
    }


    /**
     * if callback returns true, continue recursing
     */
    export function forEachRecursiveNode(root: ts.Node, callback: (node: ts.Node) => boolean) {
        
        let level = 0;
        let recurse = (child: ts.Node) => {
            if (callback(child)) {
                ts.forEachChild(child, recurse);
            }
        };
        ts.forEachChild(root, recurse);
    }

    export function forEachRecursiveNodeWithCallstack(root: ts.Node, callback: (node: ts.Node, callstack: string[]) => boolean) {
        
        let level = 0;
        let callstack: string[] = [];

        let getCallStackAddition = (node: ts.Node) => {

            if (ts.isClassDeclaration(node)) {
                return Help.getName(node);
            }
            
            if (ts.isNamespaceExportDeclaration(node)) {
                return Help.getName(node);
            }

            return undefined;
        }

        let recurse = (child: ts.Node) => {

            if (callback(child, callstack)) {
                let add = getCallStackAddition(child);
                if (add) callstack.push(add);
                ts.forEachChild(child, recurse);
                if (add) callstack.pop();
            }

        };
        ts.forEachChild(root, recurse);
    }
    export function forEachRecursiveNodeAndParent(root: ts.Node, callback: (node: ts.Node, parent?: ts.Node) => boolean) {
        
        let parent: ts.Node | undefined = undefined;
        let recurse = (child: ts.Node) => {
            let doRecurse = callback(child, parent) 
            let OGparent = parent;
            if (doRecurse) {
                parent = child;
                ts.forEachChild(child, recurse);
            }
            parent = OGparent;
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
        
        // console.log(node)
        // ts.forEachChild(node, (child) => {
        //     console.log(child);
        // })
    }

    export function getName(node: ts.Node) : string {
        try {
            //@ts-ignore
            return node.name.escapedText;
        } catch {
            // console.warn("Cannot get name of ", node);
            return ""
        }        
    }

    export function getTypeName(node: ts.TypeNode) : string {
        try {
            //@ts-ignore
            return node.typeName.escapedText;
        } catch {
            console.warn("Cannot read the type of ", node);
            return ""
        }
    }
}

export namespace DTSLoading {

    export async function load(codePath: string, name: string, options: any) {
            
        let code = await WebIO.getText(codePath);
        let source = ts.createSourceFile(codePath, code, ts.ScriptTarget.Latest);
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
                // console.log(Help.getKind(node));

                // here we are !                
            }
            return true;
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
    export function extractTypeDeclarations(source: ts.Node, types: Map<string, TypeShim>, blackList?: Set<string>) {

        Help.forEachRecursiveNode(source, (node) => {
            let type = tryExtractReferenceNode(node, types, blackList);
            if (!type) return false;

            if (types.has(type.name)) {
                console.warn("duplicate type declaration: ", type.name);
                return false;
            }

            types.set(type.name, type);
            return true;
        });

        return types;
    }

    function tryExtractReferenceNode(node: ts.Node, types: Map<string, TypeShim>, blacklist?: Set<string>) {
        
        // Name
        let name = Help.getName(node);
        if (name == "") return undefined; // we require things with names
        if (blacklist && blacklist.has(name)) {
            // console.log("blacklisted!");
            return undefined;  
        } 

        // Class
        if (ts.isClassDeclaration(node)) {
            // Debug.info("FOUND A CLASS");
            let subTypes: TypeShim[] = [];
            for (let member of node.members) {
                if (!ts.isPropertyDeclaration(member)) continue;
                let memberName = Help.getName(member);
                
                //@ts-ignore
                let memberType: ts.TypeNode = member.type;
                
                if (!memberType) continue;

                subTypes.push(convertTypeToShim(memberName, memberType, types))
            }
            return createTraitedTypeShim(name, Type.Object, undefined, subTypes);
        }

        // Interface
        // TODO : recursive reference!
        if (ts.isInterfaceDeclaration(node)) {
            // Debug.info("FOUND AN INTERFACE");
            let subTypes: TypeShim[] = [];
            for (let member of node.members) {
                let memberName = Help.getName(member);
                //@ts-ignore
                let memberType = member.type;

                subTypes.push(convertTypeToShim(memberName, memberType, types))
            }
            return createTraitedTypeShim(name, Type.Object, undefined, subTypes);
        }

        // Alias
        if (ts.isTypeAliasDeclaration(node)) {
            let typeName = Help.getTypeName(node.type);
            let subType = convertTypeToShim(typeName, node.type, types);
            return createTraitedTypeShim(name, Type.Reference, undefined, [subType]);
        }

        // none
        return undefined;
    } 

    export function extractFunctionShims(
        source: ts.Node, 
        moduleName: string, 
        jsModule: any, 
        types: Map<string, TypeShim>,
        blackList?: Set<string>
        ) {
        
        let shims: FunctionShim[] = [];

        Help.forEachRecursiveNodeWithCallstack(source, (node, callStack) => {

            if (!ts.isFunctionLike(node)) return true;

            // Extract a name, but cancel if the name is invalid or blacklisted
            let name = Help.getName(node);
            if (name == "") return true;
            if (blackList && blackList.has(name)) return false;
            
            // TODO implement constructors once typeReferences are done 
            if (node.kind == ts.SyntaxKind.Constructor) return false;

            // Do something slightly different for non-static methods
            let isNonStaticMethod = false;
            let methodInput: TypeShim | undefined;
            if (node.kind == ts.SyntaxKind.MethodDeclaration && !Help.isStatic(node)) {
                
                // convert the method to a static method
                // console.log("FOUND A NORMAL METHOD!");
                // console.log(node);
                // console.log(callStack);
                isNonStaticMethod = true;

                // add the 'this' object as the first input.
                let thisObjectType = callStack[callStack.length-1]; 
                let myType = types.get(thisObjectType);
                if (!myType) {
                    console.error("this would be weird");
                    return false;
                }
                methodInput = TypeShim.new(thisObjectType, Type.Reference, undefined, [myType]); 
            } 
            
            // extract inputs
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
                return convertTypeToShim(inputName, typeNode, types);
            });
            if (methodInput) inputs = [methodInput, ...inputs];

            // extract outputs
            let outputs: TypeShim[] = []; 
            if (ts.isTupleTypeNode(node.type!)) {
                let tuple = node.type as ts.TupleTypeNode;
                for (let i = 0; i < tuple.elements.length; i++) {
                    outputs.push(convertTypeToShim("", tuple.elements[i], types))
                }
            } else {
                outputs.push(convertTypeToShim("", node.type!, types))
            }

            // extract function using the name and callstack
            // NOTE: I dont think this is bulletproof, but it 'll work for now
            let js = jsModule;
            for (let call of [...callStack]) {
                js = js[call]
            } 
            let theFunction = js[name];
            if (isNonStaticMethod) {
                // console.log("dealing with non-static boy")
                // console.log(js);
                // console.log(js['prototype'][name]);
                // console.log(js['prototype'][name])
                theFunction = js['prototype'][name];
                // let wrapper = function(...args: any[]) { 
                //     return this.call(args[0], args.slice(1)) 
                // }
            }
            // if (callStackAdditions.length != 0) {
            //     theFunction = js[name]
            // }

            // add the actual functionShim
            let path = [moduleName, ...callStack, name];
            let shim = new FunctionShim(name, path, theFunction, inputs, outputs, isNonStaticMethod);
            shims.push(shim);
            return true;
        })

        return shims;
    }

    function convertTypeToShim(name: string, node: ts.TypeNode, typeReferences: Map<string, TypeShim>) : TypeShim {
        
        // saveguard
        if (!node) {
            console.warn("node does not appear to exist...");
            console.warn(node, name)
            return TypeShim.new(name, Type.any);
        }

        // 'base' types 
        switch (node.kind) {
            case ts.SyntaxKind.VoidKeyword: return TypeShim.new(name, Type.void);
            case ts.SyntaxKind.AnyKeyword: return TypeShim.new(name, Type.any);
            case ts.SyntaxKind.BooleanKeyword: return TypeShim.new(name, Type.boolean);
            case ts.SyntaxKind.NumberKeyword: return TypeShim.new(name, Type.number);
            case ts.SyntaxKind.StringKeyword: return TypeShim.new(name, Type.string);
            case ts.SyntaxKind.UndefinedKeyword: return TypeShim.new(name, Type.void);
        } 

        // list type 
        if (ts.isArrayTypeNode(node)) {
            // WARN: geofront does not want mix-typed lists. this does not check if that is indeed the case
            let subs = [convertTypeToShim("item", node.elementType, typeReferences)]
            return createTraitedTypeShim(name, Type.List, undefined, subs);
        } 
        
        // union type
        if (ts.isUnionTypeNode(node)) {
            let subs = node.types.map((child, i) => convertTypeToShim(`option ${i}`, child, typeReferences));
            return createTraitedTypeShim(name, Type.Union, undefined, subs);
        }
        
        // literal object type 
        if (ts.isTypeLiteralNode(node)) {
            let subs = node.members.map((element) => {
                
                // This is kind of strange... dont know why ts does not recognise these calls. Disconnect between data & header?
                // @ts-ignore 
                let elementName: string = element.name.escapedText;
                // @ts-ignore
                let elementType: ts.TypeNode = element.type;

                return convertTypeToShim(elementName, elementType, typeReferences);
            });
            return createTraitedTypeShim(name, Type.Object, undefined, subs);
        }

        // referenced object type
        if (ts.isTypeReferenceNode(node)) {

            // @ts-ignore
            let typeName = node.typeName.escapedText;

            // look up if the reference matches previously defined types
            if (typeName == "Promise") {
                // this is a promise, get the subtype
                let subs = node.typeArguments!.map(t => convertTypeToShim("promised", t, typeReferences));
                return TypeShim.new(name, Type.Promise, undefined, subs);
            }

            if (typeReferences.has(typeName)) {
                return createTraitedTypeShim(name, Type.Reference, undefined, [typeReferences.get(typeName)!]);
            } else {
                console.warn("could not find the reference type titled: ", typeName);
                return TypeShim.new(name, Type.any);
            }
        }

        if (node.kind == ts.SyntaxKind.LiteralType) {
          
            //@ts-ignore
            let text = node.literal.text || "";

            return TypeShim.new(name, Type.Literal, undefined, [TypeShim.new(text, Type.string)]);    
        }

        console.warn("type not implemented: ", Help.getKind(node));
        return TypeShim.new(name, Type.any);
    }

    /**
     * Create typeshim, and try to apply traits
     */
    function createTraitedTypeShim(name: string, type: Type, glyph?: string | undefined, child?: TypeShim[] | undefined) {
        let shim = TypeShim.new(name, type, glyph, child);
        tryApplyTraits(shim);
        return shim;
    }
}
