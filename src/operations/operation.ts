

export type FN = (...args: boolean[]) => boolean[]

/**
 * Wraps a function, and delivers some useful information
 * This is needed, so we can reason about the functionalities of chips
 */
export class Operation {

    private constructor(
        private func: FN,
        public readonly name: string,
        public readonly inputs: number, 
        public readonly outputs: number) {}

    static new(func: FN) {
        let inCount = Operation.countInputs(func);
        let outCount = Operation.countOutputs(func);
        let name = func.name;
        return new Operation(func, name, inCount, outCount);
    }

    run(...args: boolean[]) {
        return this.func(...args); 
    }

    log() {
        console.log(`name: ${this.func.name}`);
        console.log(`inputs: ${this.inputs}`);
        console.log(`outputs: ${this.outputs}`);    
    }

    static countInputs(operation: FN) {
        return operation.length;
    }

    static countOutputs(operation: FN) {
        // HACK: its hard to determine the number of inputs, so im directly reading the string of the operation, 
        // and derriving it from the number of comma's found in the return statement.
        // this could create some nasty unforseen side effects...
        let findoutputs = /return.*(\[.*\]).*/
        let results = findoutputs.exec(operation.toString()) || "";
        let r = results[results.length-1];
        let count = r.split(',').length;
        return count;
    }
}