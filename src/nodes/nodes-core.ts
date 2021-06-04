// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { Camera2 } from "../ctx/ctx-camera";
import { Domain2, InputState, MultiLine, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire body of nodes
 */
export class NodesCanvas {
    
    private redrawNextFrame = true;
    private recs: Domain2[] = [];
    private size = 40;

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
        
        let redraw = this.camera.update(this.state);
        if (redraw) {
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
        // ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);
        ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
        camera.moveCtxToState(ctx);

        // draw grid 
        this.drawGrid(ctx);

        // draw rectangles 
        for(let rec of this.recs) {
            this.drawRectangle(ctx, rec);
        }

        ctx.restore();
    }

    drawGrid(ctx: CTX) {
 
        let cross = (x: number, y: number, s: number) => {
            ctx.moveTo(x, y-s);
            ctx.lineTo(x, y+s);
            ctx.moveTo(x-s, y);
            ctx.lineTo(x+s, y);
        }

        let box = this.camera.getBox();
        let width = box.x.size();
        let height = box.y.size();
        let size = this.size;
        let crosssize = size/6;
        let topleft = Vector2.new(box.x.t0, box.y.t0);
        let gridStart = this.toWorld(this.toGrid(topleft));

        ctx.save();
        ctx.fillStyle = '#292C33';
        ctx.lineWidth = 0.11;
        ctx.beginPath();
        for (let x = gridStart.x; x < box.x.t1; x += size) {
            for (let y = gridStart.y; y < box.y.t1; y += size) {
                cross(x, y, crosssize);
            }
        }
        ctx.stroke();
        ctx.restore();
    }

    drawRectangle(ctx: CTX, rec: Domain2) {
        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(rec.x.t0, rec.y.t0, rec.x.size(), rec.y.size());
        ctx.strokeStyle = 'white';
        ctx.lineCap = "square";
        ctx.lineWidth = 3;
        ctx.strokeRect(rec.x.t0, rec.y.t0, rec.x.size(), rec.y.size());
        ctx.restore();
    }

    toGrid(wv: Vector2) {
        return Vector2.new(
            Math.round((wv.x - (this.size/2)) / this.size),
            Math.round((wv.y - (this.size/2)) / this.size)
        )
    }

    toWorld(gv: Vector2) {
        return gv.scaled(this.size);
    }

    onClick(pos: Vector2) {

        // round to grid size
        let g = this.toGrid(pos);
        pos = Vector2.new(g.x * this.size, g.y * this.size);

        this.recs.push(Domain2.fromWH(pos.x,pos.y,this.size * 3,this.size * 2))
        this.requestRedraw();
    }

    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}