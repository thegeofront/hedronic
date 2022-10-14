import { Parameter } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { PluginConversion } from "../../../modules/types/rust-conversion";
import { GeoType, JsType, reflect } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";
import { MAX_NUM_PARAMETERS } from "./list-widget";

export const MAX_NUMBER_PARAMETERS = 30;

/**
 * Special component with variable number of outputs
 */
export class GetWidget extends Widget {

    bufferState: {
        keys: Array<string>,
        types: Array<JsType>,
    } = {keys: [], types: []};

    saveState: {
        keys: Array<string>,
        types: Array<JsType>,
    } = {keys: [], types: []};

    static makeOuts(keys: string[], types: JsType[]) {
        let outs = [];
        for (let [i, key] of keys.entries()) {
            outs.push(TypeShim.new(key, types[i]));
        }
        return outs;
    }

    static new(state: any) {
        let ins = [TypeShim.new("I", JsType.Object, undefined, [])];
        let outs = state ? GetWidget.makeOuts(state.keys, state.types) : [];
        let widget = new GetWidget("get", WidgetSide.Process, undefined, ins, outs, state);
        widget.saveState = state;
        widget.bufferState = state;
        return widget;
    }

    async run(...args: State[]) {
        let obj = args[0] as any;
        if (!obj) return [];

        // if per chance, this is a plugin datatype, convert it
        // TODO: we should make cable converters which automatically deal with all the types & conversions...
        // if (PluginConversion.isConvertableTo(obj, GeoType.Json)) {
        //     obj = PluginConversion.tryConvertTo(obj, GeoType.Json);  
        // } 

        this.buffer(obj);
        if (this.saveState.keys.length == 1) {
            return this.saveState.keys.map(key => obj[key])[0];
        }
        return this.saveState.keys.map(key => obj[key]);
    }

    buffer(obj: any) {
        let keys = Object.keys(obj).slice(0, MAX_NUMBER_PARAMETERS);
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
        // TODO : remove buffer state, and only now try to access the cache of the input cable
        // saves us from storing the buffer EVERYTIME this widget runs
        if (!this.saveState) return;
        let {types, keys } = this.bufferState;
        this.saveState = this.bufferState;
        this.outs = GetWidget.makeOuts(keys, types);
        this.onChange();
    }

    onClose() {
        // TODO
        // hmmmm to do this right, we need to disconnect. thay means, we need to get access to the node
        // we need to get the canvas as context
        this.outs = [];
        this.onChange();
    }

    clone() {
        if (!this.saveState) {
            return GetWidget.new(undefined);
        }
        return GetWidget.new(JSON.parse(JSON.stringify(this.saveState)));
    }
}