import { Domain2, Vector2 } from "../../../engine/src/lib";
import { CTX } from "../ctx/ctx-helpers";
import { State } from "../graph/state";
import { Widget, WidgetSide } from "../graph/widget";
import { NodesCanvas } from "../nodes-canvas/nodes-canvas";

export class TextWidget extends Widget {

    static new(state: State) {
        return new TextWidget("text", WidgetSide.Input, Vector2.new(4,1), state);
    }

    clone() {
        return TextWidget.new(this.state);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        renderTextInWidget(this, `${this.state}`, ctx, pos, component, cellSize);
    }

    onClick(canvas: NodesCanvas) {
        let text = prompt("Input:", "data");
        if (text) {
            this.state = text;
        }
        canvas.deselectSocket();
        canvas.graph.calculate();
    }
}

export function renderTextInWidget(w: Widget, text: string, ctx: CTX, pos: Vector2, component: number, cellSize: number) {
    let size = w.bounds.size().scaled(cellSize);
    pos = pos.clone();
    pos.x += w.bounds.x.t0 * cellSize;
    pos.y += w.bounds.y.t0 * cellSize;
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