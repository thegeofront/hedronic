// purpose: bunch of 'pure' functions to render nodes & cables

/**
 * NOTE: maybe give this a svg-style overhaul...
 */

import { MultiVector2, MultiVector3, Polyline, Vector2 } from "../../../engine/src/lib";
import { GeonNode, NODE_WIDTH } from "../graph/node";
import { Operation } from "../graph/operation";
import { CTX, NodesCanvas } from "./nodes-canvas";
import { CtxCamera } from "../ctx/ctx-camera";
import { Cable, CableState } from "../graph/cable";
import { NodesGraph } from "../graph/graph";
import { Widget } from "../graph/widget";
import { drawPolygon, filletPolyline, strokePolyline } from "../ctx/ctx-helpers";

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


/**
 * Draw the chip shape
 * returns 
 */
 function nodeShape(ctx: CTX, pos: Vector2, numInputs: number, numOutputs: number, nodeHeight: number, size: number) : [MultiVector2, MultiVector2] {
    const part = 5;
    const step = size / part;
    const height = nodeHeight * part;
    const width = NODE_WIDTH * part;
    
    const is = 2; // input block start 
    const ie = 8.5; // input block end 
    const oe = 11.5; // output block end
    const os = 18; // output block start

    const fillet = 0.5;

    // define a bunch of labda's to make life easier
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
    let vecs: Vector2[] = [];
    vecs.push(coord(height / 2, width / 2)); // the center of the thing

    // we will repeat this step twice
    let drawBlockShape = (height: number, numItems: number, ga: number, gb: number, gc: number, gd: number, ge: number, gf: number) => {
        if (numItems == 0) return;
        moveTo(1.0, gf);
        lineTo(1.0, ge);
        lineTo(0.5, gd);
        lineTo(0.5, gb);        
        
        for(let i = 0; i < height; i++) {
            let offset = i * 5;
            if (i < numItems) {
    
                // store center
                vecs.push(coord(offset + 2.5, gc));
    
                // draw zig-zag
                lineTo(offset+1  , ga);
                lineTo(offset+4  , ga);
                lineTo(offset+4.5, gb);
                if (i != nodeHeight-1)
                    lineTo(offset+5.5, gb);
            } else {
                // draw straight line
                // lineTo(offset+4.5, colb);
            }
        }

        // bottom line 
        lineTo(height-0.5, (gd + gb) / 2);
        lineTo(height-0.5, gd);
        lineTo(height-1.0, ge);
        lineTo(height-1.0, gf);
        // lineTo(0.5, gb);
    }

    drawBlockShape(height, numInputs,  is, is + fillet, is + fillet, ie - fillet, ie, oe);
    drawBlockShape(height, numOutputs, os, os - fillet, os - fillet, oe + fillet, oe, ie);

    let polygon = MultiVector2.fromList([
        coord(fillet*2, ie),
        coord(height-fillet*2, ie),
        coord(height-fillet*2, oe),
        coord(fillet*2, oe),
    ]);

    return [MultiVector2.fromList(vecs), polygon];
}


export function drawNode(ctx: CTX, node: GeonNode, canvas: NodesCanvas, component: number, style: DrawState) {

    // convert style 
    let isWidget = node.core instanceof Widget;

    let pos = canvas.toWorld(node.position);
    const BAR_WIDTH = 5;
    ctx.beginPath();

    // draw body
    setStyle(ctx, style, component, 0, false); // isWidget
    if (node.errorState != "") {
        ctx.fillStyle = "orangered"
    }
    let [textCenters, centerPolygon] = nodeShape(ctx, pos, node.core.inputs, node.core.outputs, node.getHeight(), canvas.size);
    ctx.fill();
    ctx.stroke();
    ctx.fill();
    // draw thing in the middle
    ctx.beginPath();
    drawPolygon(ctx, centerPolygon);
    ctx.fillStyle = "#222211";
    ctx.fill();
    // ctx.stroke();

    // draw operation text
    if (!isWidget) {
        
        // TODO: do somemthing smart with the name to make it fit
        let name = node.core.name;
        // name = "www";
        let maxSize = 3 + (node.getHeight() -1) * 7;
        if (name.length > maxSize) {
            // console.log("too long!");
            name = `${name.slice(0, maxSize-1)}..`;   
        }
        

        ctx.fillStyle = '#cecdd1';
        ctx.font = `small-caps bold 14px sans-serif`;
        // ctx.rotate
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        let op_center = textCenters.get(0);
        ctx.translate(op_center.x, op_center.y);
        ctx.rotate(Math.PI*-0.5);
        ctx.fillText(name, 0, 0);
        ctx.rotate(Math.PI*0.5);
        ctx.translate(-op_center.x, -op_center.y);
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
    strokePolyline(ctx, line);
}


function setStyle(ctx: CTX, state: DrawState, component: number, componentDrawn: number, isWidget: boolean) {

    ctx.strokeStyle = "#cecdd1";
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
