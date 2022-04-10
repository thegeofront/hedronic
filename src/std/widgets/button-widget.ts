import { Vector2 } from "../../../../engine/src/lib";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";

export class ButtonWidget extends Widget {

    // we must copy-paste `new` and `clone` to make sure the type stays consistent
    static new(state: State) {
        let outs = [TypeShim.new("O", Type.boolean)];
        return new ButtonWidget("button", WidgetSide.Input, Vector2.new(1,1), [], outs, state);
    }

    clone() {
        return ButtonWidget.new(this.saveState);
    }

    onClick(canvas: NodesCanvas) {
        this.saveState = !this.saveState;
        canvas.deselect();
        canvas.onWidgetChange(this.hash);
    }
}