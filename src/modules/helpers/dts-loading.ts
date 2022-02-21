

import * as ts from "typescript";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { IO } from "../../nodes-canvas/util/io";
import { FunctionShim } from "../shims/function-shim";
import { OldFunctionShim } from "../shims/old-function-shim";

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

        // ts.forEachChild(sourceFile, visitNode);
        // convertToShims(source);

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


    export function extractFunctionShims(source: ts.Node, moduleName="untitled") {
        
        let shims: FunctionShim[] = [];

        DTSHelpers.forEachRecursiveNode(source, (node) => {
            if (ts.isFunctionLike(node)) {
                if (node.kind == ts.SyntaxKind.Constructor) return;
                if (node.kind == ts.SyntaxKind.MethodDeclaration) return;
                if (!node.name) return;
                
                // debug
                // console.log(`found function! kind: ${getKind(node)}`);
                // console.log(node);
                
                // get name and invoke
                //@ts-ignore
                const name = node.name.escapedText;
                const invoke = [name];

                console.log(name);
                const inputs = node.parameters.map((p) => visitType(node));
                // console.log("inputs", );
                console.log("outputs", node.type);
                // return;

                // let shim = new FunctionShim()
            }

            // if (node.kind == ts.SyntaxKind.MethodDeclaration) {
            //     // this is static method
            //     // console.log(node);

            //     console.log("found static method!");
            //     // return;
            //     // return;
            // }
        })

        return shims;
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