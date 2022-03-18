import { Parameter } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { State } from "../../model/state";
import { Widget, WidgetSide } from "../../model/widget";
import { MAX_NUM_PARAMETERS } from "./list-set-widget";

/**
 * Special component with variable number of outputs
 */
export class ListGetWidget extends Widget {

    private lastListLength?: number;
    private param!: Parameter;

    static makeOutsOfCount(n: number) {
        let outs = [];
        for (let i = 0; i < n; i++) {
            outs.push(TypeShim.new(i.toString(), Type.any));
        }
        return outs;
    }

    static new(state: State) {
        let ins = [TypeShim.new("L", Type.List, undefined, [TypeShim.new("items", Type.any)])];
        let outs  = ListGetWidget.makeOutsOfCount(state as number);
        let param = Parameter.new("output count: ", outs.length, 0, MAX_NUM_PARAMETERS, 1);
        let widget = new ListGetWidget("list get", WidgetSide.Process, undefined, ins, outs, state);
        widget.param = param;
        return widget;
    }

    async run(...args: State[]) {
        let list = args[0] as Array<any>;
        this.lastListLength = list.length;
        return [...list];
    }

    makeMenu(): HTMLElement[] {
        return [
            MenuMaker.number(this.param, this.onChangeCount.bind(this)), 
            MenuMaker.button("auto", this.setAutoCount.bind(this))
        ];
    }

    setAutoCount() {
        this.param.set(this.lastListLength || 3, false);
        this.setCount(this.param.get());
    }

    onChangeCount() {
        this.setCount(this.param.get());
    }

    setCount(n: number) {
        this.outs = ListGetWidget.makeOutsOfCount(n);
        this.state = this.outs.length;
        this.onChange();
    }

    clone() {
        return ListGetWidget.new(this.state);
    }
}