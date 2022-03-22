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

    private keys?: string[];

    // private outCountSetting!: Parameter;

    static new(state: State) {
        let ins = [TypeShim.new("I", Type.any, undefined, [TypeShim.new("items", Type.any)])];
        let outs: TypeShim[]  = [];
        let widget = new GetterWidget("getter", WidgetSide.Process, undefined, ins, outs, state);
        return widget;
    }

    async run(...args: State[]) {
        let obj = args[0] as any;
        if (!obj) return [];
        this.keys = Object.keys(obj);
        return this.keys.map(key => obj.hasOwnProperty(key) ? obj[key] : undefined);
    }

    makeMenu(): HTMLElement[] {
        return [
            // MenuMaker.number(this.outCountSetting, this.onChangeCount.bind(this)), 
            MenuMaker.button("auto", this.onMakeOutputKeys.bind(this))
        ];
    }

    onMakeOutputKeys() {
        let outs = [];
        if (!this.keys) return;
        for (let key of this.keys) {
            outs.push(TypeShim.new(key, Type.any));
        }
        this.outs = outs;
        this.onChange();
    }

    clone() {
        return GetterWidget.new(this.saveState);
    }
}