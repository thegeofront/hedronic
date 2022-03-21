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

        let outs = [TypeShim.new("O", Type.number)];
        let iw = new SliderWidget("slider", WidgetSide.Input, Vector2.new(4,1), [], outs, state);
        iw.parameter = Parameter.new(iw.name, Number(iw.state), 0, 10, 1);
        return iw;
    }

    clone() {
        return SliderWidget.new(this.state);
    }

    render(ctx: CTX, pos: Vector2, component: number, cellSize: number) {
        // renderTextInWidget(this, `${this.state}`, ctx, pos, component, cellSize);
    }

    makeMenu(): HTMLElement[] {
        // TODO make some controls 
        return [MenuMaker.slider(this.parameter, undefined, (p) => this.setState(p.get()))];
    }

    setState(state: number) {
        this.state = state;
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