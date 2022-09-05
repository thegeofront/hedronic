// purpose: bunch of 'pure' functions to render nodes & cables

import { MultiVector2, Vector2 } from "../../../../engine/src/lib";
import { CTX, drawPolygon, drawStutterPolygon, filletPolyline, movePolyline } from "./ctx/ctx-helpers";
import { NODE_WIDTH, GeonNode } from "../model/node";
import { Widget, WidgetSide } from "../model/widget";
import { NodesCanvas } from "../nodes-canvas";
import { Socket } from "../model/socket";
import { NodesGraph } from "../model/graph";
import { CableStyle } from "../model/cable";

export const MUTED_WHITE = "#cecdd1";

const Style = getComputedStyle(document.body);
const SECONDARY_3 = Style.getPropertyValue("--secondary-color-3");
const SECONDARY_5 = Style.getPropertyValue("--secondary-color-5");
const NODE_COLOR = Style.getPropertyValue("--node-color");
const NODE_EDGE = Style.getPropertyValue("--node-edge");

const COLOR_NULL    = Style.getPropertyValue("--null-color");
const COLOR_BOOLEAN = Style.getPropertyValue("--boolean-color");
const COLOR_NUMBER  = Style.getPropertyValue("--number-color");
const COLOR_STRING  = Style.getPropertyValue("--string-color");
const COLOR_BUFFER  = Style.getPropertyValue("--buffer-color");
const COLOR_LIST    = Style.getPropertyValue("--list-color");
const COLOR_OBJECT  = Style.getPropertyValue("--object-color");

/**
 * NOTE: maybe give this a svg-style overhaul...
 */

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
    
    const is = 1; // input block start 
    const ie = 8.5; // input block end 
    const oe = 11.5; // output block end
    const os = 24 - 5; // output block start

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

    drawBlockShape(height, numInputs,  is, is + fillet, is + 1, ie - fillet, ie, oe);
    drawBlockShape(height, numOutputs, os, os - fillet, os - 1, oe + fillet, oe, ie);

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
    const BAR_HEIGHT = 7;
    const BAR_WIDTH = 0.8;
    const BAR_OFFSET = 4;
    ctx.beginPath();

    // draw body
    setNodeStyle(ctx, style, component, 0, isWidget); // isWidget
    if (node.errorState != "") {
        ctx.fillStyle = "orangered"
    }
    let [textCenters, centerPolygon] = nodeShape(ctx, pos, node.core.inCount, node.core.outCount, node.getHeight(), canvas.size);
    ctx.fill();
    ctx.stroke();
    ctx.fill();
    // draw thing in the middle
    ctx.beginPath();
    drawPolygon(ctx, centerPolygon);
    // ctx.fillStyle = isWidget ? "" : "#292C33";
    ctx.fill();

    // ctx.beginPath();
    // let lineStore = ctx.lineWidth;
    // ctx.lineWidth = 1;
    // drawStutterPolygon(ctx, centerPolygon.forEach(p => p.copy(p.lerp(textCenters.get(0), 0.2))));
    // ctx.lineWidth = lineStore;
    // ctx.strokeStyle = "#ff0000"
    // ctx.stroke();
    // ctx.strokeStyle = "#ffffff"

    // draw operation text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // ctx.font = `small-caps bold 14px sans-serif`;
    
    if (!isWidget || node.widget?.side == WidgetSide.Process) {
        
        let name = node.core.name;
        let maxSize = 3 + (node.getHeight() -1) * 7;
        if (name.length > maxSize) {
            // console.log("too long!");
            name = name.slice(0, maxSize-1);   
        }
        
        ctx.fillStyle = ctx.strokeStyle;
        
        // ctx.rotate
        ctx.font = '12px consolas';
        let op_center = textCenters.get(0);
        ctx.translate(op_center.x, op_center.y);
        ctx.rotate(Math.PI*-0.5);
        ctx.fillText(name, 0, 0);
        ctx.rotate(Math.PI*0.5);
        ctx.translate(-op_center.x, -op_center.y);
    }

    // draw input text
    ctx.font = '10px arial';
    for (let i = 0 ; i < node.core.inCount; i++) {
        setNodeStyle(ctx, style, component, -1 - i, isWidget); // -1 signals input1, -2 signals input2, etc...
        ctx.fillStyle = ctx.strokeStyle;
        let vec = textCenters.get(1 + i);
        // ctx.fillRect(vec.x - BAR_OFFSET - BAR_WIDTH, vec.y-BAR_HEIGHT, BAR_WIDTH*2, BAR_HEIGHT*2);
        
        // text label
        ctx.textAlign = 'left';
        let text = node.core.ins[i].render()
        ctx.fillText(text, vec.x, vec.y);
    }
    
    // draw output text
    for (let i = 0 ; i < node.core.outCount; i++) {
        setNodeStyle(ctx, style, component, i + 1, isWidget);
        ctx.fillStyle = ctx.strokeStyle;
        let vec = textCenters.get(1 + node.core.inCount + i);
        // ctx.fillRect(vec.x + BAR_OFFSET - BAR_WIDTH, vec.y - BAR_HEIGHT , BAR_WIDTH * 2, BAR_HEIGHT * 2);
        
        // text label
        ctx.textAlign = 'right';
        let text = node.cables[i].type.render()
        ctx.fillText(text, vec.x, vec.y);
    }

    // render widget
    if (isWidget) {
        let widget = node.core as Widget;
        setNodeStyle(ctx, style, component, 0, isWidget);
        widget.render(ctx, pos, component, canvas.size);
    }
}


function setNodeStyle(ctx: CTX, state: DrawState, component: number, componentDrawn: number, isWidget: boolean) {

    // var style = getComputedStyle(document.body);
    // console.log(style.getPropertyValue('--accent-color-2'));
    ctx.strokeStyle = NODE_EDGE;
    ctx.fillStyle = NODE_COLOR;
    ctx.lineWidth = 1;

    ctx.font = Style.getPropertyValue("--font-lead");

    if (state == DrawState.OpSelected   && (component == componentDrawn || component == 0)) {
        ctx.strokeStyle = Style.getPropertyValue('--accent-color-0');
        ctx.fillStyle = Style.getPropertyValue('--accent-color-3');
        ctx.lineWidth = 4;
        return;
    } else if (state == DrawState.OpHover && component == componentDrawn) {
        ctx.strokeStyle = Style.getPropertyValue('--accent-color-1') || "#dd0000";
        ctx.lineWidth = 2;
    } else if (state == DrawState.OpPlacement) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = ctx.strokeStyle + "44"
    }

    if (isWidget) {
        // ctx.strokeStyle = NODE_COLOR;
        // ctx.fillStyle = NODE_EDGE;
    }
}

class CableSocketMetaData {

    constructor(
        public index: number, 
        public height: number) {}

    static new(index: number, height: number): CableSocketMetaData {
        return new CableSocketMetaData(index, height)
    }

    // how much must a zig zag line move minimally in order to not cross the node itself?
    minZigZagUp() {
        return -this.index;
    }

    // how much must a zig zag line move minimally in order to not cross the node itself?
    minZigZagDown() {
        return (this.height + 1) - this.index;
    }
}



export function drawMultiCable(ctx: CTX, from: Socket, tos: Socket[], style: CableStyle, canvas: NodesCanvas, graph: NodesGraph) {

    // draw a bunch of lines
    let lines = [];
    let fromNode = graph.nodes.get(from.hash)!;
    let fromGridPos = fromNode.getConnectorGridPosition(from.idx)!;
    let fromIndexAndHeight = CableSocketMetaData.new(Math.abs(from.idx), fromNode.getHeight());
    for (let to of tos) {
        let toNode = graph.nodes.get(to.hash)!;
        let toGridPos = toNode.getConnectorGridPosition(to.idx)!;
        let toIndexAndHeight =  CableSocketMetaData.new(Math.abs(to.idx), toNode.getHeight());
        let line = generateCableLine(fromGridPos, toGridPos, canvas, fromIndexAndHeight, toIndexAndHeight);
        if (line) lines.push(line);
    }
    strokeLines(ctx, style, lines);
}

export function renderCable(ctx: CTX, fromGridPos: Vector2, toGridPos: Vector2, canvas: NodesCanvas, style: CableStyle) {
    let line = generateCableLine(fromGridPos, toGridPos, canvas);
    if (line) strokeLines(ctx, style, [line]);
}

export function strokeLines(ctx: CTX, style: CableStyle, lines: MultiVector2[]) {
    
    // apply style
    let mainColor = "white";
    let edgeColor = "black";

    if (style == CableStyle.Off) {
        mainColor = NODE_COLOR
        edgeColor = "black";
    } else if (style == CableStyle.Selected || style == CableStyle.SelectedList) {
        mainColor = Style.getPropertyValue("--accent-color-0");
        // mainColor = "white";
        edgeColor = Style.getPropertyValue("--accent-color-3");
    } else if (style == CableStyle.Dragging) {
        mainColor = "white";
        edgeColor = "white";
    } else if (style == CableStyle.On) {
        mainColor = "white"
        edgeColor = "black"
    }

    if (style == CableStyle.List || style == CableStyle.SelectedList) {
        // draw the line twice with different settings
        ctx.beginPath();
        for (let line of lines) movePolyline(ctx, line);
        ctx.lineCap = "round"; 
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.strokeStyle = edgeColor;
        ctx.lineWidth = 3;
        ctx.stroke();
        // ctx.strokeStyle = mainColor;
        // ctx.lineWidth = 2;
        // ctx.stroke();
        return;
    }

    // draw the line twice with different settings
    ctx.lineCap = "round"; 
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 8;
    ctx.beginPath();
    for (let line of lines) movePolyline(ctx, line);
    ctx.stroke();
    ctx.strokeStyle = mainColor;
    ctx.lineWidth = 6;
    ctx.stroke();
}

/**
 *  line goes : (a) --- hor --- (b) --- diagonal --- (c) --- ver --- (d) --- diagonal --- (e) --- hor --- (f)
 */
export function generateCableLine(fromGridPos: Vector2, toGridPos: Vector2, canvas: NodesCanvas, fromData?: CableSocketMetaData, toData?: CableSocketMetaData) {

    let size = canvas.size;
    let hgs = canvas.size / 2;

    // a and f are the start & end points
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

    
    if (delta.x < 1) {
        fillet = size * 0.25;
        
        // make an S line
        let yZigZagDelta = 1;

        // make the zigzag very small if delta is 1
        if (delta.y == -1 || delta.y == 1) {
            yZigZagDelta = 0.5;
        }    

        // if true, this is a upwards zigzag
        let upwardsZigZag = delta.y < 0;
        if (upwardsZigZag) {
            
            yZigZagDelta *= -1;
        } 
    
        // construct deltas
        if (fromData && toData) {
            // if upwardszigzag from moves up, to moves down
            let fromMin = upwardsZigZag ? fromData.minZigZagUp() : fromData.minZigZagDown();
            let toMin = upwardsZigZag ? toData.minZigZagDown() : toData.minZigZagUp();

            let leftover = Math.abs(delta.y) - Math.abs(fromMin) - Math.abs(toMin);
            
            if (leftover < 0) {
                // if not enough space: divide equally,
                leftover *= (upwardsZigZag ? -1 : 1);
                distanceFromSocket.y = fromMin + leftover * 0.5;
                distanceToSocket.y = toMin - leftover * 0.5;    
            } else {
                // else, 
                leftover *= (upwardsZigZag ? -1 : 1);
                distanceFromSocket.y = fromMin + leftover;
                distanceToSocket.y = toMin;
            }            
        } else {
            // fallback delta 
            distanceFromSocket.y = delta.y - yZigZagDelta;
            distanceToSocket.y = -yZigZagDelta;
        }

        // apply all delta's 
        let b = a.clone();
        let c = a.clone();

        let d = f.clone();
        let e = f.clone();

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
        // make a straight line 
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
    return line;
}