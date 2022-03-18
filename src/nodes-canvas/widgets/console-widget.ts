import { Domain2, Vector2 } from "../../../../engine/src/lib";
import { CTX } from "../rendering/ctx/ctx-helpers";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";
import { renderTextInWidget } from "./input-widget";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";

export class ConsoleWidget extends Widget {

    str = "";

    static new(state: State) {
        let ins = [TypeShim.new("I", Type.any)];
        return new ConsoleWidget("console", WidgetSide.Output, Vector2.new(5,1), ins, [], state);
    }

    async run(...args: State[]) {
        this.state = args[0];
        try {
            this.str = this.state!.toString()
        } catch(error) {
            this.str = `<Error: Could not parse json. \nReason: ${(error as Error).message}>`
        }
        return [];
    }

    set(data: string) {
        this.str = data;
        // TODO RECALC / INVALIDATE / REQUEST RECALCULATION
    }

    clone() {
        return ConsoleWidget.new(this.state);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        renderTextInWidget(this, this.str, ctx, pos, component, cellSize);
    }

    makeMenu(): HTMLElement[] {
        // TODO render a text field
        return [];   
    }
}