// purpose: bunch of 'pure' functions to render nodes & cables

import { Context, MultiVector2, Vector2 } from "../../../engine/src/lib";
import { GeonNode } from "../elements/node";
import { Operation } from "../operations/operation";
import { CTX, NodesController } from "./nodes-controller";
import * as OPS from "../operations/functions";
import { CtxCamera } from "../ctx/ctx-camera";
import { Cable } from "../elements/cable";
import { NodesGraph } from "../elements/graph";

const NODE_GRID_WIDTH = 3;

export enum NodeState {
    Normal,
    Hover,
    Selected,
    Placement,
}

export function drawNode(ctx: CTX, node: GeonNode, canvas: NodesController, component: number, style: NodeState) {

    let max = Math.max(node.op.inputs, node.op.outputs);
    let pos = canvas.toWorld(node.gridpos);
    
    const BAR_WIDTH = 5;

    ctx.save();

    // draw body
    ctx.translate(pos.x, pos.y);
    ctx.beginPath();

    setStyle(ctx, style, component, 0);

    let textCenters = nodeShape(ctx, node.op.inputs, node.op.outputs, canvas.size);
    ctx.fill();
    ctx.stroke();

    // draw operation text
    ctx.fillStyle = "white";
    ctx.font = '20px courier new';
    // ctx.rotate
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let op_center = textCenters.get(0);
    // ctx.translate(op_center.x, op_center.y);
    // ctx.rotate(Math.PI*-0.5);
    ctx.fillText(node.op.name, op_center.x, op_center.y);
    

    // draw input text
    ctx.font = '12px courier new';
    for (let i = 0 ; i < node.op.inputs; i++) {
        setStyle(ctx, style, component, -1 - i); // -1 signals input1, -2 signals input2, etc...
        let vec = textCenters.get(1 + i);
        // ctx.fillText('|', vec.x, vec.y);
        ctx.fillRect(vec.x-2 - (2 * ctx.lineWidth), vec.y-BAR_WIDTH, 2 * ctx.lineWidth, BAR_WIDTH*2);
    }

    // draw output text
    for (let i = 0 ; i < node.op.outputs; i++) {
        setStyle(ctx, style, component, i + 1);
        let vec = textCenters.get(1 + node.op.inputs + i);
        ctx.fillRect(vec.x+2, vec.y-BAR_WIDTH, 2 * ctx.lineWidth, BAR_WIDTH*2);
        // ctx.fillText('|', vec.x, vec.y);
    }

    // ctx.fillStyle = '#222222';
    // ctx.fillRect(0, 0, rec.x.size(), rec.y.size());
    // ctx.strokeStyle = '#ffffff';
    // ctx.lineCap = "square";
    // ctx.lineWidth = 1;
    // ctx.strokeRect(0, 0, rec.x.size(), rec.y.size());
    ctx.restore();
}

export function drawCable(ctx: CTX, cable: Cable, controller: NodesController) {

    // use the components in the graph to figure out the from and to position
    let hgs = controller.size / 2
    let graph = controller.graph;
    let fromNode = graph.nodes.get(cable.from)!;
    let fromGridPos = fromNode.getComponentGridPosition(cable.fromComp)!;
    let a = controller.toWorld(fromGridPos).addn(hgs, hgs);

    // fromNode?.getComponentGridPosition()
    let toNode = graph.nodes.get(cable.to)!;
    let toGridPos = toNode.getComponentGridPosition(cable.toComp)!;
    let d = controller.toWorld(toGridPos).addn(hgs, hgs);

    // determine b and c 
    let b = a.clone();
    b.addn(hgs,0);
    let c = d.clone();
    c.addn(-hgs,0);

    if (c.x - b.x > 0) {
        b.addn( hgs, 0);
        c.addn(-hgs, 0);
    }

    ctx.strokeStyle = "white";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.lineTo(c.x, c.y);
    ctx.lineTo(d.x, d.y);
    ctx.stroke();
}


function setStyle(ctx: CTX, state: NodeState, component: number, componentDrawn: number) {

    ctx.strokeStyle = "#aaaaaa";
    ctx.fillStyle = "#222222";
    ctx.lineWidth = 1;

    if (state == NodeState.Selected && component == componentDrawn) {
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#332222";
        ctx.lineWidth = 2;
    } else if (state == NodeState.Hover && component == componentDrawn) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
    } else if (state == NodeState.Placement) {
        ctx.lineWidth = 0.5;
    }

    if (componentDrawn != 0) {
        ctx.fillStyle = ctx.strokeStyle;
    }
}




/**
 * Draw the chip shape
 * returns 
 */
 function nodeShape(ctx: CTX, inputs: number, outputs: number, size: number) : MultiVector2 {
    let max = Math.max(inputs, outputs);
    let part = 5;
    let step = size / part;
    let width = max * part;
    
    let cola = 0.5
    let colb = 1;
    let colc = 1.5;
    let cold = 5 + 8.5;
    let cole = 5 + 9;
    let colf = 5 + 9.5;

    let coord = (x: number,y: number) => {
        return Vector2.new(y*step, x*step);
    }
    let moveTo = (x: number, y: number) => {
        ctx.moveTo(y*step, x*step);
    }
    let lineTo = (x: number, y: number) => {
        ctx.lineTo(y*step, x*step);
    }

    // calculate coorindates of input, output, and body centers
    let vecs = MultiVector2.new(inputs + outputs + 1);
    vecs.set(0, coord(width/2, colf/2));

    // top
    moveTo(0.5, cole);
    lineTo(0.5, cold);
    lineTo(0.5, colc);
    lineTo(0.5, colb);

    // draw inputs
    for(let i = 0; i < max; i++) {
        let offset = i * 5;
        if (i < inputs) {

            // store center
            vecs.set(1 + i, coord(offset+ 2.5, colb))

            // draw zig-zag
            lineTo(offset+1  , cola);
            lineTo(offset+4  , cola);
            lineTo(offset+4.5, colb);
            if (i != max-1)
                lineTo(offset+5.5, colb);
        } else {
            // draw straight line
            // lineTo(offset+4.5, colb);
        }
    }

    // bottom
    // lineTo(width-0.5, 4); // colb
    lineTo(width-0.5, 5); // colc
    lineTo(width-0.5, 10); // cold
    // lineTo(width-0.5, 6); // cole

    // draw outputs
    moveTo(0.5, cole);
    for(let i = 0; i < max; i++) {
        let offset = i * 5;
        if (i < outputs) {

            // store center
            vecs.set(1 + inputs + i, coord(offset+ 2.5, cole))

            // draw zig-zag
            lineTo(offset+1  , colf);
            lineTo(offset+4  , colf);
            lineTo(offset+4.5, cole);
            if (i != max-1)
                lineTo(offset+5.5, cole);
        } else {
            // draw straight line
            // lineTo(offset+4.5,cole);
        }
    }
    lineTo(width-0.5, 10); // cold
    return vecs;
}

function test() {
    let and_operation = Operation.new(OPS.and);
    let not_operation = Operation.new(OPS.not);

    let and_chip = GeonNode.new(Vector2.new(6,10), and_operation);
    let or_chip = GeonNode.new(Vector2.new(1,1), not_operation);

    and_chip.log();
    or_chip.log();
}

