import { Domain2, MultiVector2, Vector2 } from "../../../engine/src/lib";
import { CTX, NodesCanvas } from "../nodes/core";
import { Operation } from "../operations/operation";


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

        // draw body
        ctx.translate(pos.x, pos.y);
        ctx.beginPath();
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#222222';
        let textCenters = shape(ctx, this.operation.inputs, this.operation.outputs, canvas.size);
        ctx.fill();
        ctx.stroke();

        // draw operation text
        ctx.fillStyle = 'white';
        ctx.font = '25px courier new';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let op_center = textCenters.get(0);
        ctx.fillText(this.operation.name.toUpperCase(), op_center.x, op_center.y);

        // draw input text
        ctx.font = '12px courier new';
        ctx.textBaseline = "top";
        for (let i = 0 ; i < this.operation.inputs; i++) {
            let vec = textCenters.get(1 + i);
            ctx.fillText('-', vec.x, vec.y);
        }

        // draw output text
        ctx.textBaseline = "bottom";
        for (let i = 0 ; i < this.operation.outputs; i++) {
            let vec = textCenters.get(1 + this.operation.inputs + i);
            ctx.fillText('-', vec.x, vec.y);
        }

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
 * returns 
 */
function shape(ctx: CTX, inputs: number, outputs: number, size: number) : MultiVector2 {
    let max = Math.max(inputs, outputs);
    let part = 5;
    let step = size / part;
    let width = max * part;
    
    let rowa = 0.5
    let rowb = 1;
    let rowc = 1.5;
    let rowd = 5 + 8.5;
    let rowe = 5 + 9;
    let rowf = 5 + 9.5;

    let coord = (x: number,y: number) => {
        return Vector2.new(x*step, y*step);
    }
    let moveTo = (x: number, y: number) => {
        ctx.moveTo(x*step, y*step);
    }
    let lineTo = (x: number, y: number) => {
        ctx.lineTo(x*step, y*step);
    }

    // calculate coorindates of input, output, and body centers
    let vecs = MultiVector2.new(inputs + outputs + 1);
    vecs.set(0, coord(width/2, rowf/2));

    // top
    moveTo(0.5, rowe);
    lineTo(0  , rowd);
    lineTo(0  , rowc);
    lineTo(0.5, rowb);

    // draw inputs
    for(let i = 0; i < max; i++) {
        let offset = i * 5;
        if (i < inputs) {

            // store center
            vecs.set(1 + i, coord(offset+ 2.5, rowb))

            // draw zig-zag
            lineTo(offset+1  , rowa);
            lineTo(offset+4  , rowa);
            lineTo(offset+4.5, rowb);
            if (i != max-1)
                lineTo(offset+5.5, rowb);
        } else {
            // draw straight line
            lineTo(offset+4.5, rowb);
        }
    }

    // bottom
    lineTo(width-0.5, rowb);
    lineTo(width-0.0, rowc);
    lineTo(width-0.0, rowd);
    lineTo(width-0.5, rowe);

    // draw outputs
    moveTo(0.5, rowe);
    for(let i = 0; i < max; i++) {
        let offset = i * 5;
        if (i < outputs) {

            // store center
            vecs.set(1 + inputs + i, coord(offset+ 2.5, rowe))

            // draw zig-zag
            lineTo(offset+1  , rowf);
            lineTo(offset+4  , rowf);
            lineTo(offset+4.5, rowe);
            if (i != max-1)
                lineTo(offset+5.5, rowe);
        } else {
            // draw straight line
            lineTo(offset+4.5,rowe);
        }
    }
    return vecs;
}


import * as OPS from "../operations/operations";

function test() {
    let and_operation = Operation.new(OPS.and);
    let not_operation = Operation.new(OPS.not);

    let and_chip = Chip.new(Vector2.new(6,10), and_operation);
    let or_chip = Chip.new(Vector2.new(1,1), not_operation);

    and_chip.log();
    or_chip.log();
}

test();

