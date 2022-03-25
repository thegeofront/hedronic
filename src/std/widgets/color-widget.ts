import { Vector2 } from "../../../../engine/src/lib";
import { MenuMaker } from "../../menu/util/menu-maker";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { CTX } from "../../nodes-canvas/rendering/ctx/ctx-helpers";

export class ColorWidget extends Widget {

    static new(state: State) {
        let outs = [TypeShim.new("color", Type.Reference, undefined, )];
        return new ColorWidget("colorPicker", WidgetSide.Input, Vector2.new(4,1), [], outs, state);
    }

    clone() {
        return ColorWidget.new(this.saveState);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        renderTextInWidget(this, `${this.saveState}`, ctx, pos, component, cellSize);
    }

    makeMenu(): HTMLElement[] {
        return [MenuMaker.textarea("text", this.saveState ? this.saveState.toString() : "", this.setState.bind(this))];
    }

    setState(state: string) {
        console.log(state);
        this.saveState = state;
        this.onChange();
    }

    onClick(canvas: NodesCanvas) {
        // let text = prompt("Input:", "data");
        // if (text) {
        //     try {
        //         this.state = JSON.parse(text);
        //     } catch(error) {
        //         this.state = (error as Error).message;
        //     }
        // }
        canvas.deselect();
        // canvas.select();
        canvas.onChange();
    }
}

export function renderTextInWidget(w: Widget, text: string, ctx: CTX, pos: Vector2, component: number, cellSize: number) {

    if (!w.domain) return;
    if (!w.size) return;

    let size = w.domain.size().scaled(cellSize);
    pos = pos.clone();
    pos.x += w.domain.x.t0 * cellSize;
    pos.y += w.domain.y.t0 * cellSize;
    let center = pos.added(w.size.scaled(0.5));

    // border
    ctx.fillRect(pos.x+2, pos.y+2, size.x-4, size.y-4);
    ctx.strokeRect(pos.x+2, pos.y+2, size.x-4, size.y-4);

    // surface
    ctx.fillStyle = "#222222";    
    ctx.fillRect(pos.x+4, pos.y+4, size.x-8, size.y-8);

    // text
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1.0;
    ctx.font = "consolas";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // let text = "henkkagtijogrjoigtrjopokpokpokpigas";
    ctx.strokeText(text, pos.x+10, pos.y+10);
}