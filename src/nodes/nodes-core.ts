// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { Camera2 } from "../ctx/ctx-camera";
import { Domain2, InputState, Rectangle2, Vector2 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire body of nodes
 */
export class NodesCanvas {
    
    private redrawNextFrame = true;
    private recs: Domain2[] = [];

    private constructor(
        private readonly ctx: CTX,
        private readonly html_ui: HTMLDivElement,

        private readonly camera: Camera2,
        private readonly state: InputState) {}

    static new(html_canvas: HTMLCanvasElement, ui: HTMLDivElement) {

        const ctx = html_canvas.getContext('2d');
        if (!ctx || ctx == null) {
            alert("Canvas Rendering not supported in your browser. Try upgrading or switching!"); 
            return undefined;
        } 

        const camera = Camera2.new(ctx.canvas, Vector2.new(-100,-100), 1);
        const state = InputState.new(ctx.canvas);

        return new NodesCanvas(ctx, ui, camera, state);
    }

    start() {
        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        this.onResize();

        this.camera.onClick = this.onClick.bind(this);
    }
    
    update(dt: number) {
        this.state.preUpdate(dt);
        
        let r = this.camera.update(this.state);
        if (r) {
            this.requestRedraw();
        }

        this.state.postUpdate();
    }

    requestRedraw() {
        this.redrawNextFrame = true;
    }

    draw() {
        if (!this.redrawNextFrame) return;
        this.redrawNextFrame = false;

        // lets start rendering! 

        let ctx = this.ctx;
        let camera = this.camera;
        ctx.save();
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        camera.moveCtxToState(ctx);
        for(let rec of this.recs) {
            this.drawRectangle(ctx, rec);
        }
        ctx.restore();
    }

    drawRectangle(ctx: CTX, rec: Domain2) {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(rec.x.t0, rec.y.t0, rec.x.size(), rec.y.size());
        ctx.restore();
    }

    onClick(pos: Vector2) {
        this.recs.push(Domain2.fromWH(pos.x,pos.y,50,50))
        this.requestRedraw();
    }

    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}