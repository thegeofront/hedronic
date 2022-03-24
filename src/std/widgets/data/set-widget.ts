import { Parameter } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";

export const MAX_NUM_PARAMETERS = 20;

/**
 * Special component with variable number of outputs
 */
export class SetWidget extends Widget {

    static makeInsOfCount(n: number) {
        let ins = [];
        for (let i = 0; i < n; i++) {
            ins.push(TypeShim.new(i.toString(), Type.any));
        }
        return ins;
    }

    static new(state: State) {
        let ins  = SetWidget.makeInsOfCount(state as number);
        let outs = [TypeShim.new("L", Type.List, undefined, [TypeShim.new("items", Type.any)])];
        return new SetWidget("set", WidgetSide.Process, undefined, ins, outs, state);
    }

    async run(...args: State[]) {
        return [[...args]];
    }

    makeMenu(): HTMLElement[] {
        let param = Parameter.new("count: ", this.ins.length, 0, MAX_NUM_PARAMETERS, 1);
        return [MenuMaker.number(param, this.onChangeCount.bind(this))]
    }

    onChangeCount(p: Parameter) {
        this.ins = SetWidget.makeInsOfCount(p.get());
        this.saveState = this.ins.length;
        this.onChange();
    }

    clone() {
        return SetWidget.new(this.saveState);
    }
}