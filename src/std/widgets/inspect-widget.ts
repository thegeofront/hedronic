import { Domain2, Vector2 } from "../../../../engine/src/lib";
import { renderTextInWidget } from "./input-widget";
import { TypeShim } from "../../modules/shims/type-shim";
import { JsType } from "../../modules/types/type";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { State } from "../../nodes-canvas/model/state";
import { CTX } from "../../nodes-canvas/rendering/ctx/ctx-helpers";
import { Element } from "../../html/util";

export class InspectWidget extends Widget {

    viewer?: any;
    state?: any;

    static new(state: any) {
        let ins = [TypeShim.new("I", JsType.any)];
        let outs = [TypeShim.new("O", JsType.any)];
        return new InspectWidget("inspect", WidgetSide.Process, undefined, ins, outs, state);
    }

    async run(...args: State[]) {
        this.set(args[0])
        return [];
    }

    set(data: any) {
        this.state = data;
        if (!this.viewer) return;
        console.log(this.state);
        this.viewer.data = this.state;
    }

    clone() {
        return InspectWidget.new(this.saveState);
    }

    makeMenu(): HTMLElement[] {
        this.viewer = Element.html`<json-viewer>""</json-viewer>`;
        if (this.state) this.set(this.state);
        return [this.viewer];   
    }
}