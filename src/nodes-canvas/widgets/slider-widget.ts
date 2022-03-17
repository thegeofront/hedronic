import { Domain2, Parameter, Vector2 } from "../../../../engine/src/lib";
import { CTX } from "../rendering/ctx/ctx-helpers";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";
import { NodesCanvas } from "../nodes-canvas";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { Element } from "../../html/util";
import { MenuMaker } from "../../menu/util/menu-maker";

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