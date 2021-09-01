import { Domain2, Vector2 } from "../../../engine/src/lib";
import { CTX } from "../ctx/ctx-helpers";
import { State } from "../graph/state";
import { Widget, WidgetSide } from "../graph/widget";
import { renderTextInWidget } from "./text-widget";

export class DisplayWidget extends Widget {

    static new(state: State) {
        return new DisplayWidget("display", WidgetSide.Output, Vector2.new(5,5), state);
    }

    clone() {
        return DisplayWidget.new(this.state);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {

        renderTextInWidget(this, `${this.state}`, ctx, pos, component, cellSize);
    }

}