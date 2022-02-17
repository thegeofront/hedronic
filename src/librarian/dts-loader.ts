

import * as ts from "typescript";
import { IO } from "../nodes-canvas/util/io";

export class DTSLoader {

    static visitNode(node: ts.Node, level=0) {
        console.log(`${"--".repeat(level)} type: ${ts.SyntaxKind[node.kind]}`);
        ts.forEachChild(node, (child) => DTSLoader.visitNode(child, level+1));
    }

    static async load(codePath: string, options: any) {
            
        let code = await IO.fetchText(codePath);
        let sourceFile = ts.createSourceFile(codePath,code, ts.ScriptTarget.Latest);
        console.log(sourceFile);
        // let checker = program.getTypeChecker();
        // let sourceNode = program.getSourceFiles()[1];

        ts.forEachChild(sourceFile, DTSLoader.visitNode);

        return false
    }

}