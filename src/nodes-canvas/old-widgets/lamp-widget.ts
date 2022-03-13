import { Vector2 } from "../../../../engine/src/lib";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";

export class LampWidget extends Widget {

    static new(state: State) {
        return new LampWidget("lamp", WidgetSide.Output, Vector2.new(1,1), state);
    }

    run(...args: State[]) : State[] {
        this.state = args[0];
        return [];
    }

    clone() {
        return LampWidget.new(this.state);
    }

}