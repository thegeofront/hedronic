import { MultiVector2, Vector2 } from "../../../engine/src/lib";

// shorthands
export type CTX = CanvasRenderingContext2D; 
export type Canvas = HTMLCanvasElement;

// for resizing
export function resizeCanvas(ctx: CTX) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    let canvas = ctx.canvas as HTMLCanvasElement;

    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = ctx.canvas.width !== displayWidth || ctx.canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
        ctx.canvas.width = displayWidth;
        ctx.canvas.height = displayHeight;
    }

    // Tell WebGL how to convert from clip space to pixels
    // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    return needResize;
}

export function drawCicle(ctx: CTX, pos: Vector2, size: number) {
    let hs = size / 2;
    ctx.beginPath();
    ctx.arc(pos.x + hs, pos.y + hs, hs, 0, Math.PI*2);
    ctx.fill();
}

export function filletPolyline(line: MultiVector2, radius: number) : MultiVector2 {

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


export function strokePolyline(ctx: CTX, pl: MultiVector2) {
    ctx.beginPath();
    let v = pl.get(0);
    ctx.moveTo(v.x, v.y);

    for (let i = 1 ; i < pl.count; i++) {
        let v = pl.get(i);
        ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
}

export function drawPolygon(ctx: CTX, polygon: MultiVector2) {
    let v = polygon.get(0);
    ctx.moveTo(v.x, v.y);

    for (let i = 1 ; i < polygon.count; i++) {
        let s = polygon.get(i);
        ctx.lineTo(s.x, s.y);
    }
    ctx.lineTo(v.x, v.y);
}