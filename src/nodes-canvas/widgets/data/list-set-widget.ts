import { Parameter } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { State } from "../../model/state";
import { Widget, WidgetSide } from "../../model/widget";

export const MAX_NUM_PARAMETERS = 20;

/**
 * Special component with variable number of outputs
 */
export class ListSetWidget extends Widget {

    static makeInsOfCount(n: number) {
        let ins = [];
        for (let i = 0; i < n; i++) {
            ins.push(TypeShim.new(i.toString(), Type.any));
        }
        return ins;
    }

    static new(state: State) {
        let ins  = ListSetWidget.makeInsOfCount(state as number);
        let outs = [TypeShim.new("L", Type.List, undefined, [TypeShim.new("items", Type.any)])];
        return new ListSetWidget("list set", WidgetSide.Process, undefined, ins, outs, state);
    }

    async run(...args: State[]) {
        return [[...args]];
    }

    makeMenu(): HTMLElement[] {
        let param = Parameter.new("count: ", this.ins.length, 0, MAX_NUM_PARAMETERS, 1);
        return [MenuMaker.number(param, this.onChangeCount.bind(this))]
    }

    onChangeCount(p: Parameter) {
        this.ins = ListSetWidget.makeInsOfCount(p.get());
        this.state = this.ins.length;
        this.onChange();
    }

    clone() {
        return ListSetWidget.new(this.state);
    }
}