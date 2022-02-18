

import * as ts from "typescript";
import { IO } from "../../nodes-canvas/util/io";

export namespace DTSLoading {

    function visitNode(node: ts.Node, level=0) {
        console.log(`${"--".repeat(level)} type: ${ts.SyntaxKind[node.kind]}`);
        ts.forEachChild(node, (child) => visitNode(child, level+1));
    }

    export async function load(codePath: string, options: any) {
            
        let code = await IO.fetchText(codePath);
        let sourceFile = ts.createSourceFile(codePath,code, ts.ScriptTarget.Latest);

        // let checker = program.getTypeChecker();
        // let sourceNode = program.getSourceFiles()[1];

        // ts.forEachChild(sourceFile, visitNode);

        return sourceFile;
    }

}