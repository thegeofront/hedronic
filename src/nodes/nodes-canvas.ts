// author : Jos Feenstra
// purpose: wrapper for dealing with the 'whole of nodes'

import { CtxCamera } from "../ctx/ctx-camera";
import { Domain2, Graph, InputState, MultiLine, Plane, Rectangle2, Vector2, Vector3 } from "../../../engine/src/lib";
import { resizeCanvas } from "../ctx/ctx-helpers";
import { NodesGraph } from "../elements/graph";
import { Chip } from "../elements/chip";
import { Operation } from "../operations/operation";
import * as OPS from "../operations/operations-default";
import { Random } from "../../../engine/src/math/random";

// shorthands
export type CTX = CanvasRenderingContext2D; 

/**
 * Represents the entire body of nodes
 */
export class NodesCanvas {
    
    private redrawNextFrame = true;
    private _size = 30;
    get size() { return this._size; }

    private constructor(
        private readonly ctx: CTX,
        private readonly html_ui: HTMLDivElement,

        private readonly camera: CtxCamera,
        private readonly input: InputState,
        private readonly graph: NodesGraph,

        public operations: Operation[],
        ) {}

    static new(htmlCanvas: HTMLCanvasElement, ui: HTMLDivElement) {

        const ctx = htmlCanvas.getContext('2d');
        if (!ctx || ctx == null) {
            alert("Canvas Rendering not supported in your browser. Try upgrading or switching!"); 
            return undefined;
        } 

        const camera = CtxCamera.new(ctx.canvas, Vector2.new(-100,-100), 1);
        const state = InputState.new(ctx.canvas);
        const graph = NodesGraph.new();

        
        let operations: Operation[] = OPS.defaultOperations.map(fn => Operation.new(fn));

        return new NodesCanvas(ctx, ui, camera, state, graph, operations);
    }

    start() {
        // hook up all functions & listeners
        window.addEventListener("resize", () => this.onResize());
        this.onResize();
        this.camera.onClick = this.onClick.bind(this);
        this.onClick(Vector2.zero());
    }
    
    update(dt: number) {
        this.input.preUpdate(dt);
        let redraw = this.camera.update(this.input);

        if (redraw) {
            this.requestRedraw();
        }
        this.input.postUpdate();
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
        for (let chip of this.graph.nodes.values()) {
            chip.draw(ctx, this);
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
        let size = this._size;
        let crosssize = size/4;
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

    // -----

    toGrid(wv: Vector2) {
        return Vector2.new(
            Math.round((wv.x - (this._size/2)) / this._size),
            Math.round((wv.y - (this._size/2)) / this._size)
        )
    }

    toWorld(gv: Vector2) {
        return gv.scaled(this._size);
    }

    onClick(pos: Vector2) {

        // round to grid size
        let g = this.toGrid(pos);
        pos = this.toWorld(g);

        // spawn node with random operation
        let rng = Random.fromRandom();
        let count = this.operations.length;
        let value = Math.floor(rng.get() * count);
        this.graph.addNode(Chip.new(g, this.operations[value]));


        this.requestRedraw();
    }

    onResize() {
        resizeCanvas(this.ctx);
        this.requestRedraw();
    }
}