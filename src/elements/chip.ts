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
        ctx.translate(pos.x, pos.y);
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#222222';
        shape(ctx, this.operation.inputs, this.operation.outputs, canvas.size);
        ctx.fill();
        ctx.stroke();

        // ctx.fillStyle = '#222222';
        // ctx.fillRect(0, 0, rec.x.size(), rec.y.size());
        // ctx.strokeStyle = '#ffffff';
        // ctx.lineCap = "square";
        // ctx.lineWidth = 1;
        // ctx.strokeRect(0, 0, rec.x.size(), rec.y.size());
        ctx.restore();
    }
}

/**
 * Draw the chip shape
 */
function shape(ctx: CTX, inputs: number, outputs: number, size: number) {
    let max = Math.max(inputs, outputs);
    let height = max * size;
    let step = size / 5;
    
    let cola = 0.5
    let colb = 1;
    let colc = 1.5;
    let cold = 8.5;
    let cole = 9;
    let colf = 9.5;

    let moveTo = (x: number, y: number) => {
        ctx.moveTo(x*step, y*step);
    }
    let lineTo = (x: number, y: number) => {
        ctx.lineTo(x*step, y*step);
    }

    // top
    moveTo(cole, 0.5);
    lineTo(cold, 0);
    lineTo(colc, 0);
    lineTo(colb, 0.5);

    // draw inputs
    for(let i = 0; i < max; i++) {
        let offset = i * 5;
        if (i < inputs) {
            // draw zig-zag
            lineTo(cola, offset+1);
            lineTo(cola, offset+4);
            lineTo(colb, offset+4.5);
            if (i != max-1)
                lineTo(colb, offset+5.5);
        } else {
            // draw straight line
            lineTo(colb, offset+4.5)
        }
    }

    // bottom
    lineTo(colb, 9.5);
    lineTo(colc, 10);
    lineTo(cold, 10);
    lineTo(cole, 9.5);

    // draw outputs
    moveTo(9, 0.5);
    for(let i = 0; i < max; i++) {
        let offset = i * 5;
        if (i < outputs) {
            // draw zig-zag
            lineTo(colf, offset+1);
            lineTo(colf, offset+4);
            lineTo(cole, offset+4.5);
            if (i != max-1)
                lineTo(cole, offset+5.5);
        } else {
            // draw straight line
            lineTo(cole, offset+4.5)
        }
    }
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

