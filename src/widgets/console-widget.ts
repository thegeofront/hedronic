import { Domain2, Vector2 } from "../../../engine/src/lib";
import { CTX } from "../ctx/ctx-helpers";
import { State } from "../graph/state";
import { Widget, WidgetSide } from "../graph/widget";
import { renderTextInWidget } from "./input-widget";

export class ConsoleWidget extends Widget {

    str = "";

    static new(state: State) {
        return new ConsoleWidget("console", WidgetSide.Output, Vector2.new(5,1), state);
    }

    run(...args: State[]) : State[] {
        this.state = args[0];
        try {
            this.str = JSON.stringify(this.state, null, 2);
        } catch(error) {
            this.str = `<Error: Could not parse json. \nReason: ${(error as Error).message}>`
        }
        return [];
    }

    clone() {
        return ConsoleWidget.new(this.state);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        renderTextInWidget(this, this.str, ctx, pos, component, cellSize);
    }

}