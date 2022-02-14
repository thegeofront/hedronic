import { Domain2, Vector2 } from "../../../../engine/src/lib";
import { State } from "../components/state";
import { Widget, WidgetSide } from "../components/widget";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";

export class ButtonWidget extends Widget {

    // we must copy-paste `new` and `clone` to make sure the type stays consistent
    static new(state: State) {
        return new ButtonWidget("button", WidgetSide.Input, Vector2.new(1,1), state);
    }

    clone() {
        return ButtonWidget.new(this.state);
    }

    onClick(canvas: NodesCanvas) {
        this.state = !this.state;
        canvas.deselect();
        canvas.graph.calculate();
    }
}