// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { Camera2 } from "../ctx/ctx-camera";
import { Domain2, InputState, Rectangle2, Vector2 } from "../../../engine/src/lib";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire body of nodes
 */
export class NodesCanvas {
    
    private redrawNextFrame = true;

    private constructor(
        private readonly html_canvas: HTMLCanvasElement, 
        private readonly ctx: CTX,
        private readonly html_ui: HTMLDivElement,

        private readonly camera: Camera2,
        private readonly inputState: InputState) {}

    static new(html_canvas: HTMLCanvasElement, ui: HTMLDivElement) {
        const ctx = html_canvas.getContext('2d');
        if (!ctx || ctx == null) {
            alert("Canvas Rendering not supported in your browser. Try upgrading or switching!"); 
            return undefined;
        } 

        const camera = Camera2.new(html_canvas, Vector2.new(100,100), 1);
        const state = InputState.new(html_canvas);
        return new NodesCanvas(html_canvas, ctx, ui, camera, state);
    }

    update() {

    }

    requestRedraw() {
        this.redrawNextFrame = true;
    }

    draw() {
        if (!this.redrawNextFrame) return;
        this.redrawNextFrame = false;

        let ctx = this.ctx;
    

        this.drawRectangle(ctx, Domain2.fromWH(10,10,100,100));
        this.drawRectangle(ctx, Domain2.fromWH(10,110,100,100));
    }

    drawRectangle(ctx: CTX, rec: Domain2) {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(rec.x.t0, rec.y.t0, rec.x.size(), rec.y.size());
        ctx.restore();
    }
}