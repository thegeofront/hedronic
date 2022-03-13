import { Domain2, Vector2 } from "../../../../engine/src/lib";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";
import { NodesCanvas } from "../nodes-canvas";

export class ImageWidget extends Widget {

    // we must copy-paste `new` and `clone` to make sure the type stays consistent
    static new(state: State) {
        let ins = [TypeShim.new("image", Type.any)];
        return new ImageWidget("image", WidgetSide.Output, Vector2.new(5,5), ins, [], state);
    }

    clone() {
        return ImageWidget.new(this.state);
    }

    onClick(canvas: NodesCanvas) {
        // this.state = !this.state;
        // canvas.deselect();
        // canvas.onChange();
    }
}