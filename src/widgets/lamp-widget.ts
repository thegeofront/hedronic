import { Vector2 } from "../../../engine/src/lib";
import { State } from "../graph/state";
import { Widget, WidgetSide } from "../graph/widget";

export class LampWidget extends Widget {

    static new(state: State) {
        return new LampWidget("lamp", WidgetSide.Output, Vector2.new(1,1), state);
    }

    clone() {
        return LampWidget.new(this.state);
    }

}