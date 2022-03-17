import { Vector2 } from "../../../../engine/src/lib";
import { HTML } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { StopVisualizeEvent, VisualizeEvent } from "../../viewer/viewer-app";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";

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

    run(...args: State[]) : State[] {
        this.state = args[0];
        HTML.dispatch(VisualizeEvent, { state: this.state, id: this.count.toString()});
        return [];
    }

    clone() {
        return ViewWidget.new(this.state);
    }

    onDestroy(): void {
        HTML.dispatch(StopVisualizeEvent, {id: this.count.toString()});
    }

}