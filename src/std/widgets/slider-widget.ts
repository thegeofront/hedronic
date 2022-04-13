import { Parameter, Vector2 } from "../../../../engine/src/lib";
import { MenuMaker } from "../../menu/util/menu-maker";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { CTX } from "../../nodes-canvas/rendering/ctx/ctx-helpers";

export class SliderWidget extends Widget {

    parameter!: Parameter;

    static new(state: State) {
        let outs = [TypeShim.new("N", Type.number)];
        let widget = new SliderWidget("slider", WidgetSide.Input, Vector2.new(4,1), [], outs, state);
        widget.parameter = Parameter.new(widget.name, Number(widget.saveState), 0, 10, 1);
        return widget;
    }

    clone() {
        return SliderWidget.new(this.saveState);
    }

    onClick(canvas: NodesCanvas) {
        document.body.style.cursor = "col-resize";

        let zoom = canvas.getZoom();
        let beginX: number | undefined = undefined;
        let beginState = this.parameter.getNorm();
        console.log(beginState)
        // lets do something incredibly wacky
        let onMouseMove = (ev: MouseEvent) => {
            if (ev.movementX == 0) return;
            if (!beginX) beginX = ev.clientX- ev.movementX;
            
            let value = beginX - ev.clientX;

            // width of the touch part * the fraction of width the handle occupies * normalize scalar
            let magic = 4 * 0.9 * 0.1;
            let valueDemped = value / zoom * magic; 
            this.parameter.setNorm(beginState - valueDemped);
            this.setState(this.parameter.get());
        }

        let onMouseUp = (ev: MouseEvent) => {
            console.log("up")
            document.body.style.cursor = "default";
            document.removeEventListener("mousemove", moveBound);
            document.removeEventListener("mouseup", upBound);
        }

        let moveBound = onMouseMove.bind(this);
        let upBound = onMouseUp.bind(this);

        document.addEventListener("mousemove", moveBound);
        document.addEventListener("mouseup", upBound);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        if (!this.domain) return;

        let size = this.domain.size().scaled(cellSize);
        const A = 4; // offset A
        const B = 6; // offset B
        const fraction = 0.5;
        const state = this.parameter.getNorm();

        pos = pos.clone();
        pos.x += this.domain.x.t0 * cellSize;
        pos.y += this.domain.y.t0 * cellSize;

        ctx.fillStyle = this.saveState ? "" : "#292C33";

        let fillstroke = (x: number, y: number, w: number, h: number) => {
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }

        fillstroke(pos.x+A, pos.y+A, size.x-A*2, size.y-A*2);
    
        ctx.fillStyle = "#000000";

        let handlewidth = (size.x-A*2) * 0.1;
        let fullWidth = (size.x-A*2) * 0.9;
        
        fillstroke(pos.x+A + state * fullWidth, pos.y+A, handlewidth, size.y-A*2);

        ctx.fillStyle = "white";
        ctx.fillText(this.saveState, pos.x + fullWidth, pos.y + size.y * 0.5);
    }

    makeMenu(): HTMLElement[] {
        return [
            MenuMaker.slider(this.parameter, undefined, (p) => this.setState(p.get())),
            // TODO these should recreate this menu
            MenuMaker.anyNumber("min", this.parameter.min, (n) => {this.parameter.min = n; this.onSettingsChange()}),
            MenuMaker.anyNumber("max", this.parameter.max, (n) => {this.parameter.max = n; this.onSettingsChange()}),
            MenuMaker.anyNumber("step", this.parameter.step, (n) => {this.parameter.step = n; this.onSettingsChange()})
        ];
    }

    onSettingsChange() {
        this.parameter.set(this.parameter.get())
        this.setState(this.saveState);
    }

    setState(state: number) {
        this.parameter.set(state);
        this.saveState = this.parameter.get();
        this.onChange();
    }
}