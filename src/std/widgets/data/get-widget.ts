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
export class GetWidget extends Widget {

    bufferState: {
        keys: Array<string>,
        types: Array<Type>,
    } = {keys: [], types: []};

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
        let outs = state ? GetWidget.makeOuts(state.keys, state.types) : [];
        let widget = new GetWidget("get", WidgetSide.Process, undefined, ins, outs, state);
        widget.saveState = state;
        return widget;
    }

    async run(...args: State[]) {
        let obj = args[0] as any;
        if (!obj) return [];
        this.buffer(obj);
        return this.saveState.keys.map(key => obj[key]);
    }

    buffer(obj: any) {
        let keys = Object.keys(obj);
        let types = [];
        for (let key of keys) {
            types.push(reflect(obj[key]));
        }
        this.bufferState = {keys, types};
    }

    makeMenu(): HTMLElement[] {
        return [
            // MenuMaker.number(this.outCountSetting, this.onChangeCount.bind(this)), 
            MenuMaker.button("open", this.onMakeOutputKeys.bind(this)),
            MenuMaker.button("close", this.onClose.bind(this))
        ];
    }

    onMakeOutputKeys() {
        if (!this.saveState) return;
        let {types, keys } = this.bufferState;
        this.saveState = this.bufferState;
        this.outs = GetWidget.makeOuts(keys, types);
        this.onChange();
    }

    onClose() {
        // fuck... to do this right, we need to know if we are connected or not. thay means, we need to get access to the node
        this.outs = [];
        this.onChange();
    }

    clone() {
        return GetWidget.new(JSON.parse(JSON.stringify(this.saveState)));
    }
}