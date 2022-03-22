import { Parameter } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type, reflect } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";
import { MAX_NUM_PARAMETERS } from "./list-widget";

/**
 * Special component with variable number of outputs
 */
export class GetterWidget extends Widget {


    saveState: {
        keys: Array<string>,
        types: Array<Type>,
    } = {keys: [], types: []};

    static makeOuts(keys: string[], types: Type[]) {
        let outs = [];
        for (let [i, key] of keys.entries()) {
            outs.push(TypeShim.new(key, types[i]));
        }
        return outs;
    }

    static new(state: any) {
        let ins = [TypeShim.new("I", Type.Object, undefined, [])];
        let outs = (state && state.length) ? GetterWidget.makeOuts(state.keys, state.types) : [];
        let widget = new GetterWidget("getter", WidgetSide.Process, undefined, ins, outs, state);
        return widget;
    }

    async run(...args: State[]) {
        let obj = args[0] as any;
        if (!obj) return [];
        this.setState(obj);
        return this.saveState.keys.map(key => obj[key]);
    }

    setState(obj: any) {
        let keys = Object.keys(obj);
        let types = [];
        for (let key of keys) {
            types.push(reflect(obj[key]));
        }
        this.saveState = {keys, types};
    }

    makeMenu(): HTMLElement[] {
        return [
            // MenuMaker.number(this.outCountSetting, this.onChangeCount.bind(this)), 
            MenuMaker.button("auto", this.onMakeOutputKeys.bind(this))
        ];
    }

    onMakeOutputKeys() {
        if (!this.saveState) return;
        let {types, keys } = this.saveState;
        this.outs = GetterWidget.makeOuts(keys, types);
        this.onChange();
    }

    clone() {
        return GetterWidget.new(this.saveState);
    }
}