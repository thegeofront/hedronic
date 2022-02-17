

import * as ts from "typescript";

export class DTSLoader {

    static visit() {

    }

    static async load(filename: string, options: any) {
            
        let program = ts.createProgram([filename], {options});
        let checker = program.getTypeChecker();
        let sourceNode = program.getSourceFiles()[1];

        ts.forEachChild(sourceNode, (n: ts.Node) => {
            console.log(n);
        },);

        return false
    }

}