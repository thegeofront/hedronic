// purpose: bunch of 'pure' functions to render nodes & cables

import { Context, MultiVector2, MultiVector3, Polyline, Vector2 } from "../../../engine/src/lib";
import { GeonNode } from "../graph/node";
import { OperationCore } from "../operations/operation";
import { CTX, NodesController } from "./nodes-controller";
import * as OPS from "../operations/functions";
import { CtxCamera } from "../ctx/ctx-camera";
import { Cable } from "../graph/cable";
import { NodesGraph } from "../graph/graph";
import { GizmoNode } from "../gizmos/_gizmo";

const NODE_GRID_WIDTH = 3;

export enum DrawState {
    Normal,
    Hover,
    Selected,
    Placement,
    Gizmo,
    GizmoHover,
    GizmoSelected,
    GizmoPlacement,
}

export function drawNode(ctx: CTX, node: GeonNode, canvas: NodesController, component: number, style: DrawState) {

    let max = Math.max(node.operation.inputs, node.operation.outputs);
    let pos = canvas.toWorld(node.position);
    
    const BAR_WIDTH = 5;

    ctx.save();

    // draw body
    ctx.translate(pos.x, pos.y);
    ctx.beginPath();

    setStyle(ctx, style, component, 0);

    let textCenters = nodeShape(ctx, node.operation.inputs, node.operation.outputs, canvas.size);
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
    ctx.fillText(node.operation.name, op_center.x, op_center.y);
    

    // draw input text
    ctx.font = '12px courier new';
    for (let i = 0 ; i < node.operation.inputs; i++) {
        setStyle(ctx, style, component, -1 - i); // -1 signals input1, -2 signals input2, etc...
        let vec = textCenters.get(1 + i);
        // ctx.fillText('|', vec.x, vec.y);
        ctx.fillRect(vec.x-2 - (2 * ctx.lineWidth), vec.y-BAR_WIDTH, 2 * ctx.lineWidth, BAR_WIDTH*2);
    }

    // draw output text
    for (let i = 0 ; i < node.operation.outputs; i++) {
        setStyle(ctx, style, component, i + 1);
        let vec = textCenters.get(1 + node.operation.inputs + i);
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

    // line goes : (a) --- hor --- (b) --- diagonal --- (c) --- ver --- (d) --- diagonal --- (e) --- hor --- (f)

    // use the components in the graph to figure out the from and to position
    let size = controller.size; 
    let hgs = controller.size / 2 // half grid size
    let graph = controller.graph;
    let fromNode = graph.nodes.get(cable.from.node)!;
    let fromGridPos = fromNode.getConnectorGridPosition(cable.from.idx)!;
    let a = controller.toWorld(fromGridPos).addn(hgs, hgs);

    // fromNode?.getComponentGridPosition()
    for (let to of cable.to) {
        let toNode = graph.nodes.get(to.node)!;
        let toGridPos = toNode.getConnectorGridPosition(to.idx)!;
        let d = controller.toWorld(toGridPos).addn(hgs, hgs);
    
        let gridDelta = toGridPos.subbed(fromGridPos);
        let something = controller.toWorld(Vector2.new(1,0));
        let delta = d.subbed(a);
        let half = delta.scaled(0.5);
        
        // make sure things are alligned to the grid nicely
        
        // if (gridDelta.x % 2 != 0) {
        //     half.x -= hgs;
        // }

        // determine b and c 
        let b = a.clone();
        b.x += something.x;
        
        let c = a.clone();
        c.x += something.x;
        c.y += delta.y;

        let line = MultiVector2.fromList([
            a,
            b,
            c,
            d
        ]);


        // let smallest = Math.min(Math.abs(gridDelta.x), Math.abs(gridDelta.y));
        // let fillet = Math.max(smallest * hgs, hgs);
        let fillet = hgs;
        line = filletPolyline(line, fillet);

        ctx.strokeStyle = "white";
        ctx.lineCap = "round";
        ctx.lineWidth = 8;
        drawPolyline(ctx, line);
    }
}

export function drawGizmo(ctx: CTX, gizmo: GizmoNode, canvas: NodesController) {
    ctx.save();
    ctx.fillStyle = "white";

    let pos = gizmo.position;
    let size = gizmo.type.size;
    
    ctx.translate(pos.x, pos.y);
    ctx.fillRect(0,0, size.x, size.y);
    ctx.restore();
}


function filletPolyline(line: MultiVector2, radius: number) : MultiVector2 {

    let count = line.count + (line.count - 2);
    let verts = MultiVector2.new(count);

    // set first and last
    verts.set(0, line.get(0));
    verts.set(count-1, line.get(Math.ceil((count-1) / 2)));

    // set in betweens
    for (let i = 1 ; i < count-1; i++) {

        let half = i / 2;
        let pointsToPrevious = (half % 1 != 0);
        let j = Math.ceil(half) // index in original 
        let vert = line.get(j);

        // apply fillet
        if (pointsToPrevious) {
            // to 
            let prev = line.get(j-1);
            vert.add(prev.subbed(vert).setLength(radius));
        } else {
            let next = line.get(j+1);
            vert.add(next.subbed(vert).setLength(radius));
        }



        verts.set(i, vert);
    }

    return verts;

    
}

function drawPolyline(ctx: CTX, pl: MultiVector2) {
    ctx.beginPath();
    for (let i = 0 ; i < 1; i++) {
        let v = pl.get(i);
        ctx.moveTo(v.x, v.y);
    }

    for (let i = 1 ; i < pl.count; i++) {
        let v = pl.get(i);
        ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
}


function setStyle(ctx: CTX, state: DrawState, component: number, componentDrawn: number) {

    ctx.strokeStyle = "#aaaaaa";
    ctx.fillStyle = "#222222";
    ctx.lineWidth = 1;

    if (state == DrawState.Selected && component == componentDrawn) {
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#332222";
        ctx.lineWidth = 2;
    } else if (state == DrawState.Hover && component == componentDrawn) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
    } else if (state == DrawState.Placement) {
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
    let and_operation = OperationCore.new(OPS.AND);
    let not_operation = OperationCore.new(OPS.NOT);

    let and_chip = GeonNode.new(Vector2.new(6,10), and_operation);
    let or_chip = GeonNode.new(Vector2.new(1,1), not_operation);

    and_chip.log();
    or_chip.log();
}

