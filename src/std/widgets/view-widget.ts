import { Vector2 } from "../../../../engine/src/lib";
import { HTML } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { JsType } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { StopVisualizeEvent, VisualizeEvent } from "../../viewer/viewer-app";

export class ViewWidget extends Widget {

    static count = 0; 
    count = 0;

    static new(state: State) {
        let ins = [TypeShim.new("Renderable", JsType.any), TypeShim.new("color", JsType.any)] 
        let outs: TypeShim[] = [];
        let widget = new ViewWidget("view", WidgetSide.Output, Vector2.new(1,2), ins, outs, state);
        widget.count = ViewWidget.count;
        ViewWidget.count += 1;
        return widget;
    }

    async run(...args: State[]) {
        let state = args[0];
        let style = args[1];
        let id = this.count.toString();
        HTML.dispatch(VisualizeEvent, { state, id, style });
        return [];
    }

    clone(): Widget {
        return ViewWidget.new(undefined);
    }

    onBeforeRun(): void {
        HTML.dispatch(StopVisualizeEvent, { id: "" });
    }

    onDestroy(): void {
        HTML.dispatch(StopVisualizeEvent, { id: this.count.toString() });
    }
}