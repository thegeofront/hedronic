import { Domain2, Vector2 } from "../../../../engine/src/lib";
import { renderTextInWidget } from "./input-widget";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { State } from "../../nodes-canvas/model/state";
import { CTX } from "../../nodes-canvas/rendering/ctx/ctx-helpers";

export class ConsoleWidget extends Widget {

    str = "";

    static new(state: any) {
        let ins = [TypeShim.new("I", Type.any)];
        return new ConsoleWidget("console", WidgetSide.Output, Vector2.new(5,1), ins, [], state);
    }

    async run(...args: State[]) {
        this.saveState = args[0];
        try {
            this.str = this.saveState!.toString()
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
        return ConsoleWidget.new(this.saveState);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        renderTextInWidget(this, this.str, ctx, pos, component, cellSize);
    }

    makeMenu(): HTMLElement[] {
        // TODO render a text field
        return [];   
    }
}