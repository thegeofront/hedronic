// purpose: bunch of 'pure' functions to render nodes & cables

import { MultiVector2, MultiVector3, Polyline, Vector2 } from "../../../engine/src/lib";
import { GeonNode } from "../graph/node";
import { Operation } from "../graph/operation";
import { CTX, NodesCanvas } from "./nodes-canvas";
import { CtxCamera } from "../ctx/ctx-camera";
import { Cable, CableState } from "../graph/cable";
import { NodesGraph } from "../graph/graph";
import { Widget } from "../graph/widget";

const NODE_GRID_WIDTH = 3;

export enum DrawState {
    Op,
    OpHover,
    OpSelected,
    OpPlacement,
}

export class StyleSet {
    
    constructor(
        text: string,
        stroke: string,
        fill: string,
        line: number
    ) {}

    static new(
        text: string,
        stroke: string,
        fill: string,
        line: number) {
        return new StyleSet(text, stroke, fill, line);
    }

}

export function drawNode(ctx: CTX, node: GeonNode, canvas: NodesCanvas, component: number, style: DrawState) {

    // convert style 
    let isWidget = node.core instanceof Widget;

    let pos = canvas.toWorld(node.position);
    const BAR_WIDTH = 5;
    ctx.beginPath();

    // draw body
    setStyle(ctx, style, component, 0, isWidget);
    
    if (node.errorState != "") {
        ctx.fillStyle = "orangered"
    }
    

    let textCenters = nodeShape(ctx, pos, node.core.inputs, node.core.outputs, node.getHeight(), canvas.size);
    ctx.fill();
    ctx.stroke();

    // draw operation text
    if (!isWidget) {
        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = '15px courier new';
        // ctx.rotate
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let op_center = textCenters.get(0);
        // ctx.translate(op_center.x, op_center.y);
        // ctx.rotate(Math.PI*-0.5);
        ctx.fillText(node.core.name, op_center.x, op_center.y);
    }

    // draw input text
    ctx.font = '12px courier new';
    for (let i = 0 ; i < node.core.inputs; i++) {
        setStyle(ctx, style, component, -1 - i, isWidget); // -1 signals input1, -2 signals input2, etc...
        let vec = textCenters.get(1 + i);
        // ctx.fillText('|', vec.x, vec.y);
        ctx.fillRect(vec.x-2 - (2 * ctx.lineWidth), vec.y-BAR_WIDTH, 2 * ctx.lineWidth, BAR_WIDTH*2);
    }

    // draw output text
    for (let i = 0 ; i < node.core.outputs; i++) {
        setStyle(ctx, style, component, i + 1, isWidget);
        let vec = textCenters.get(1 + node.core.inputs + i);
        ctx.fillRect(vec.x+2, vec.y-BAR_WIDTH, 2 * ctx.lineWidth, BAR_WIDTH*2);
        // ctx.fillText('|', vec.x, vec.y);
    }

    // render widget
    if (isWidget) {
        let widget = node.core as Widget;
        setStyle(ctx, style, component, 0, isWidget);
        widget.render(ctx, pos, component, canvas.size);
    }
}

export function drawCable(ctx: CTX, cable: Cable, canvas: NodesCanvas) {

    // use the components in the graph to figure out the from and to position
    let fromNode = canvas.graph.nodes.get(cable.from.node)!;
    let fromGridPos = fromNode.getConnectorGridPosition(cable.from.idx)!;

    for (let to of cable.to) {
        let toNode = canvas.graph.nodes.get(to.node)!;
        let toGridPos = toNode.getConnectorGridPosition(to.idx)!;
        drawCableBetween(ctx, fromGridPos, toGridPos, canvas, cable.state);
    }
}

/**
 *  line goes : (a) --- hor --- (b) --- diagonal --- (c) --- ver --- (d) --- diagonal --- (e) --- hor --- (f)
 */
export function drawCableBetween(ctx: CTX, fromGridPos: Vector2, toGridPos: Vector2, canvas: NodesCanvas, state: CableState) {

    let size = canvas.size;
    let hgs = canvas.size / 2;

    let a = canvas.toWorld(fromGridPos).addn(hgs, hgs);
    let f = canvas.toWorld(toGridPos).addn(hgs, hgs);

    let delta = toGridPos.subbed(fromGridPos);
    let distanceFromSocket = Vector2.new(0, 0);
    let distanceToSocket = Vector2.new(0, 0);

    let fillet = size * 0.5;
 
    if (delta.x == 0 && delta.y == 0) {
        return;
    }

    // make the horizontal line break move correctly 
    let xBreak = 1;
    if (delta.x < 1) {
        xBreak = 1; 
    } else if (delta.x == 1) {
        fillet = size * 0.25;
        // xBreak = 0.5;
    } else if (delta.x <= 4) {
        xBreak = delta.x / 2;
    } else if (delta.x > 4) {
        xBreak = 2;
    }

    // make the vertical line break move correctly  
    let yBreak = 1;
    let line;

    // apply horizontal line break
    distanceFromSocket.x = xBreak;
    distanceToSocket.x = -(delta.x - xBreak);
    if (delta.x == 1) {
        distanceFromSocket.x = 0.5;
        distanceToSocket.x = -0.5;
    } else if (delta.x < 2) {
        distanceToSocket.x = -xBreak;
    }  

    // apply vertical line break
    if (delta.x < 1) {
        fillet = size * 0.25;
        if (delta.y == -1 || delta.y == 1) {
            yBreak = 0.5;
        }    
        if (delta.y < 0) {
            yBreak *= -1;
        }
        // distanceFromSocket.y = yBreak;
        // distanceToSocket.y = -delta.y + yBreak;

        distanceFromSocket.y = delta.y - yBreak;
        distanceToSocket.y = -yBreak;

        // 
        let b = a.clone();
        let c = a.clone();

        let d = f.clone();
        let e = f.clone();

        // figure out b and c 
        b.x += distanceFromSocket.x * size;
        c.x += distanceFromSocket.x * size;
        c.y += distanceFromSocket.y * size;

        d.x += distanceToSocket.x * size;
        d.y += distanceToSocket.y * size;
        e.x += distanceToSocket.x * size;

        line = MultiVector2.fromList([
            a,
            b,
            c,
            d,
            e,
            f,
        ]);
    } else {
        // 
        let b = a.clone();
        let e = f.clone();

        // figure out b and c 
        b.x += distanceFromSocket.x * size;
        e.x += distanceToSocket.x * size;

        line = MultiVector2.fromList([
            a,
            b,
            e,
            f,
        ]);
    }

    line = filletPolyline(line, fillet);
    if (state == CableState.Null) {
        ctx.strokeStyle = "#222222";
    } else if (state == CableState.Boolean) {
        ctx.strokeStyle = "#08FD4E";
    } else if (state == CableState.Number) {
        ctx.strokeStyle = "#FD08B7";
    } else if (state == CableState.String) {
        ctx.strokeStyle = "#FDC908";
    } else if (state == CableState.Object) {
        ctx.strokeStyle = "#083DFD";
    } else if (state == CableState.Selected) {
        ctx.strokeStyle = "white";
    } else {
        ctx.strokeStyle = "#222222";
    }

    
    ctx.lineCap = "round";
    // ctx.lineJoin = "bevel";
    ctx.lineWidth = 8;
    drawPolyline(ctx, line);
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
    let v = pl.get(0);
    ctx.moveTo(v.x, v.y);

    for (let i = 1 ; i < pl.count; i++) {
        let v = pl.get(i);
        ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
}


function setStyle(ctx: CTX, state: DrawState, component: number, componentDrawn: number, isWidget: boolean) {

    ctx.strokeStyle = "#ffffff";
    ctx.fillStyle = "#222222";
    ctx.lineWidth = 1;

    if (state == DrawState.OpSelected   && component == componentDrawn) {
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#332222";
        ctx.lineWidth = 4;
    } else if (state == DrawState.OpHover && component == componentDrawn) {
        ctx.strokeStyle = "#dd0000";
        ctx.lineWidth = 2;
    } else if (state == DrawState.OpPlacement) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = ctx.strokeStyle + "44"
    }

    if (componentDrawn != 0) {
        ctx.fillStyle = ctx.strokeStyle;
    }

    if (isWidget) {
        let temp = ctx.fillStyle;
        ctx.fillStyle = ctx.strokeStyle
        ctx.strokeStyle = temp;
    }
}


function getStyle(state: DrawState) {
    // ctx.strokeStyle = "#aaaaaa";
    // ctx.fillStyle = "#222222";
    // ctx.lineWidth = 1;

    switch (state) {
        case DrawState.Op:
            return new StyleSet("white", "#aaaaaa", "#222222", 1);
        case DrawState.OpHover:
            return new StyleSet("white", "#aaaaaa", "#222222", 1);
        case DrawState.OpSelected:
            return new StyleSet("white", "#aaaaaa", "#222222", 1);
        case DrawState.OpPlacement:
            return new StyleSet("white", "#aaaaaa", "#222222", 1);
    }
}

function gizmoShape(ctx: CTX, pos: Vector2, input: boolean, output: boolean, wh: Vector2, size: number) {
    let part = 5;
    let step = size / part;
    let coord = (x: number,y: number) => {
        return Vector2.new(pos.x + y*step, pos.y + x*step);
    }
    let moveTo = (x: number, y: number) => {
        ctx.moveTo(pos.x + y*step, pos.y + x*step);
    }
    let lineTo = (x: number, y: number) => {
        ctx.lineTo(pos.x + y*step, pos.y + x*step);
    }
}

/**
 * Draw the chip shape
 * returns 
 */
function nodeShape(ctx: CTX, pos: Vector2, inputs: number, outputs: number, nodeHeight: number, size: number) : MultiVector2 {
    let part = 5;
    let step = size / part;
    let height = nodeHeight * part;
    let width = 15;

    let cola = 2.5;
    let colb = 3;
    let colc = 3;
    let cold = 12;
    let cole = 12;
    let colf = 12.5;

    let coord = (x: number,y: number) => {
        return Vector2.new(pos.x + y*step, pos.y + x*step);
    }
    let moveTo = (x: number, y: number) => {
        ctx.moveTo(pos.x + y*step, pos.y + x*step);
    }
    let lineTo = (x: number, y: number) => {
        ctx.lineTo(pos.x + y*step, pos.y + x*step);
    }

    // calculate coorindates of input, output, and body centers
    let vecs = MultiVector2.new(inputs + outputs + 1);
    vecs.set(0, coord(height/2, width/2));

    // top
    moveTo(0.5, cole);
    lineTo(0.5, cold);
    lineTo(0.5, colc);
    lineTo(0.5, colb);

    // draw inputs
    for(let i = 0; i < nodeHeight; i++) {
        let offset = i * 5;
        if (i < inputs) {

            // store center
            vecs.set(1 + i, coord(offset+ 2.5, colc))

            // draw zig-zag
            lineTo(offset+1  , cola);
            lineTo(offset+4  , cola);
            lineTo(offset+4.5, colb);
            if (i != nodeHeight-1)
                lineTo(offset+5.5, colb);
        } else {
            // draw straight line
            // lineTo(offset+4.5, colb);
        }
    }

    // bottom
    // lineTo(width-0.5, 4); // colb
    lineTo(height-0.5, 5); // colc
    lineTo(height-0.5, 10); // cold
    // lineTo(width-0.5, 6); // cole

    // draw outputs
    moveTo(0.5, cole);
    for(let i = 0; i < nodeHeight; i++) {
        let offset = i * 5;
        if (i < outputs) {

            // store center
            vecs.set(1 + inputs + i, coord(offset+ 2.5, cold))

            // draw zig-zag
            lineTo(offset+1  , colf);
            lineTo(offset+4  , colf);
            lineTo(offset+4.5, cole);
            if (i != nodeHeight-1)
                lineTo(offset+5.5, cole);
        } else {
            // draw straight line
            // lineTo(offset+4.5,cole);
        }
    }
    lineTo(height-0.5, 10); // cold
    return vecs;
}

function drawCicle(ctx: CTX, pos: Vector2, size: number) {
    let hs = size / 2;
    ctx.beginPath();
    ctx.arc(pos.x + hs, pos.y + hs, hs, 0, Math.PI*2);
    ctx.fill();
}