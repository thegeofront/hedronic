import { Parameter } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";
import { MAX_NUM_PARAMETERS } from "./list-widget";

/**
 * Special component with variable number of outputs
 */
export class ListGetWidget extends Widget {

    private lastListLength?: number;
    private outCountSetting!: Parameter;

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
        let outCountSetting = Parameter.new("output count: ", outs.length, 0, MAX_NUM_PARAMETERS, 1);
        let widget = new ListGetWidget("list get", WidgetSide.Process, undefined, ins, outs, state);
        widget.outCountSetting = outCountSetting;
        return widget;
    }

    async run(...args: State[]) {
        let list = args[0] as Array<any>;
        this.lastListLength = list.length;
        return [...list];
    }

    makeMenu(): HTMLElement[] {
        return [
            MenuMaker.number(this.outCountSetting, this.onChangeCount.bind(this)), 
            MenuMaker.button("auto", this.setAutoCount.bind(this))
        ];
    }

    setAutoCount() {
        this.outCountSetting.set(this.lastListLength || 3, false);
        this.setCount(this.outCountSetting.get());
    }

    onChangeCount() {
        this.setCount(this.outCountSetting.get());
    }

    setCount(n: number) {
        this.outs = ListGetWidget.makeOutsOfCount(n);
        this.saveState = this.outs.length;
        this.onChange();
    }

    clone() {
        return ListGetWidget.new(this.saveState);
    }
}