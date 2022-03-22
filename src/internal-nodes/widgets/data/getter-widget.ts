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
export class GetterWidget extends Widget {

    saveState: string[] = [];

    static makeOuts(keys: string[]) {
        let outs = [];
        for (let key of keys) {
            outs.push(TypeShim.new(key, Type.any));
        }
        return outs;
    }

    static new(state: any) {
        let ins = [TypeShim.new("I", Type.any, undefined, [TypeShim.new("items", Type.any)])];
        let outs = (state && state.length) ? GetterWidget.makeOuts(state) : [];
        let widget = new GetterWidget("getter", WidgetSide.Process, undefined, ins, outs, state);
        return widget;
    }

    async run(...args: State[]) {
        let obj = args[0] as any;
        if (!obj) return [];
        this.saveState = Object.keys(obj);
        return this.saveState.map(key => obj.hasOwnProperty(key) ? obj[key] : undefined);
    }

    makeMenu(): HTMLElement[] {
        return [
            // MenuMaker.number(this.outCountSetting, this.onChangeCount.bind(this)), 
            MenuMaker.button("auto", this.onMakeOutputKeys.bind(this))
        ];
    }

    onMakeOutputKeys() {
        if (!this.saveState) return;
        this.outs = GetterWidget.makeOuts(this.saveState);
        this.onChange();
    }

    clone() {
        return GetterWidget.new(this.saveState);
    }
}