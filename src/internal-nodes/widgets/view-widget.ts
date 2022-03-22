import { Vector2 } from "../../../../engine/src/lib";
import { HTML } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { StopVisualizeEvent, VisualizeEvent } from "../../viewer/viewer-app";

export class ViewWidget extends Widget {

    static count = 0; 
    count = 0;

    static new(state: State) {
        let ins = [TypeShim.new("Renderable", Type.any)]
        let outs: TypeShim[] = [];
        let widget = new ViewWidget("view", WidgetSide.Output, Vector2.new(1,2), ins, outs, state);
        widget.count = ViewWidget.count;
        ViewWidget.count += 1;
        return widget;
    }

    async run(...args: State[]) {
        this.saveState = args[0];
        HTML.dispatch(VisualizeEvent, { state: this.saveState, id: this.count.toString() });
        return [];
    }

    clone() {
        return ViewWidget.new(this.saveState);
    }

    onDestroy(): void {
        HTML.dispatch(StopVisualizeEvent, { id: this.count.toString() });
    }

}