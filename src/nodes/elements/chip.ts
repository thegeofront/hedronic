import { Vector2 } from "../../../../engine/src/lib";
import { CTX } from "../core";

type FN = (...args: boolean[]) => boolean[]

export class Chip {

    private constructor(public gridpos: Vector2, public operation: FN) {}

    static new(gridpos: Vector2, func: FN) {
        return new Chip(gridpos, func);
    }

    run(...args: boolean[]) {
        return this.operation(...args);
    }

    log() {
        console.log(`chip at ${this.gridpos}`);
        // this.operation.name
        console.log("operation")
        console.log(`name: ${this.operation.name}`);
        console.log(`inputs: ${this.operation.length}`);
        console.log(`outputs: ${this.operation}`);

        //TODO : do a regex string hack to retrieve the number of returned values...
        
    }

    draw(ctx: CTX) {
        ctx.save();
        ctx.restore();
    }
}


function test() {
    let AND = function(a: boolean, b: boolean, c: boolean, d: boolean) : boolean[] { return [a && b] };
    let chip = Chip.new(Vector2.zero(), AND);
    chip.log();
}

test();

