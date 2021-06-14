import { Vector2 } from "../../../engine/src/lib";
import { Operation } from "../operations/operation";
import { Comp } from "./graph";


export class GeonNode {

    private constructor(
        public gridpos: Vector2, 
        public readonly op: Operation) {}

    static new(gridpos: Vector2, op: Operation) {
        return new GeonNode(gridpos, op);
    }

    run(...args: boolean[]) {
        return this.op.run(...args);
    }

    log() {
        console.log(`chip at ${this.gridpos}`);
        // this.operation.name
        console.log("operation: ")
        this.op.log();
    }

    getComponentGridPosition(c: Comp) {
        let gp = this.getComponentLocalGridPosition(c); 
        if (gp === undefined) {
            return undefined;
        }
        return this.gridpos.added(gp);
    }

    getComponentLocalGridPosition(c: Comp) {
        
        if (c + 1 > -this.op.inputs && c < 0) {
            // input
            let input = (c * -1) - 1;
            return Vector2.new(0, input);
        } else if (c > 0 && c-1 < this.op.outputs) {
            // output 
            let output = c - 1;
            return Vector2.new(2, output);
        } else {
            return undefined;
        }
    }

    trySelect(gp: Vector2) : number | undefined {
        let max = Math.max(this.op.inputs, this.op.outputs);

        // see if this vector lands on an input socket, an output socket, or the body
        let local = gp.subbed(this.gridpos);
        if (local.y < 0 || local.y >= max) {
            return undefined;
        } else if (local.x == 0) {
            if (local.y < this.op.inputs) {
                return -(local.y + 1) // selected input
            } else {
                return 0; // selected body
            }
        } else if (local.x == 1) {
            return 0; // selected body
        } else if (local.x == 2) {
            if (local.y < this.op.outputs) {
                return local.y + 1 // selected input
            } else {
                return 0; // selected body
            }
        }
        return undefined;
        
    }
}
