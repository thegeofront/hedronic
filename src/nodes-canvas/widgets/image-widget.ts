import { Domain2, Vector2 } from "../../../../engine/src/lib";
import { State } from "../components/state";
import { Widget, WidgetSide } from "../components/widget";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";

export class ImageWidget extends Widget {

    // we must copy-paste `new` and `clone` to make sure the type stays consistent
    static new(state: State) {
        return new ImageWidget("image", WidgetSide.Output, Vector2.new(5,5), state);
    }

    clone() {
        return ImageWidget.new(this.state);
    }

    onClick(canvas: NodesCanvas) {
        this.state = !this.state;
        canvas.deselect();
        canvas.graph.calculate();
    }
}