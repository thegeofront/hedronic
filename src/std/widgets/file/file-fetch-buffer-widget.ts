import { Vector2, WebInput, WebIO } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";

export class FileFetchBufferWidget extends Widget {
    
    dataState: Uint8Array | undefined = undefined;

    static new(state: State) {
        let outs = [TypeShim.new("content", JsType.Blob)];
        return new FileFetchBufferWidget("file fetch as blob", WidgetSide.Input, Vector2.new(2,2), [], outs, state);
    }

    clone() {
        return FileFetchBufferWidget.new(this.saveState);
    }

    makeMenu(): HTMLElement[] {
        return [MenuMaker.textarea("url", this.saveState || "", this.onInput.bind(this))];
    }

    onClick() {
        let str = WebInput.askForString("url:") || "";
        this.onInput(str);
    }

    async onInput(str: string) {
        if (!str) return;
        this.saveState = str;
        
        let blob = await WebIO.getBlob(str);
        let buffer = await blob.arrayBuffer();
        if (buffer == null) {
            alert("could not process file as blob");
            return;  
        } 
        var uint8View = new Uint8Array(buffer);
        this.dataState = uint8View; // NOTE: this is a sad way of doing things...
        this.onChange();
    }   

    async run(...args: State[]) : Promise<State | State[]> {
        return this.dataState; 
    }
}