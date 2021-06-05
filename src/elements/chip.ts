import { Domain2, Vector2 } from "../../../engine/src/lib";
import { CTX, NodesCanvas } from "../nodes/core";
import { Operation } from "./operation";


/**
 * NOTE: I would like to call this 'Node', but that clashes with the STD...
 * NOTE: A Chip might share an Operation with other Chips.
 */
export class Chip {

    private constructor(
        public gridpos: Vector2, 
        public readonly operation: Operation) {}

    static new(gridpos: Vector2, func: Operation) {
        return new Chip(gridpos, func);
    }

    run(...args: boolean[]) {
        return this.operation.run(...args);
    }

    log() {
        console.log(`chip at ${this.gridpos}`);
        // this.operation.name
        console.log("operation: ")
        this.operation.log();
    }

    draw(ctx: CTX, canvas: NodesCanvas) {

        let pos = canvas.toWorld(this.gridpos);
        let rec = Domain2.fromWH(pos.x,pos.y, canvas.size * 2, canvas.size * 2);
        
        ctx.save();
        ctx.fillStyle = '#222222';
        ctx.fillRect(rec.x.t0, rec.y.t0, rec.x.size(), rec.y.size());
        ctx.strokeStyle = '#ffffff';
        ctx.lineCap = "square";
        ctx.lineWidth = 1;
        ctx.strokeRect(rec.x.t0, rec.y.t0, rec.x.size(), rec.y.size());
        ctx.restore();
    }
}

function path(ctx: CTX, i: number, o: number) {
    
}

function test() {
    let AND = function(a: boolean, b: boolean) : boolean[] { return [a && b] };
    let NOT = function(a: boolean) : boolean[] { return [!a] };

    let and_operation = Operation.new(AND);
    let not_operation = Operation.new(NOT);

    let and_chip = Chip.new(Vector2.new(6,10), and_operation);
    let or_chip = Chip.new(Vector2.new(1,1), not_operation);

    and_chip.log();
    or_chip.log();
}

test();

