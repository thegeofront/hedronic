import { Vector2 } from "../../../../engine/src/lib";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";

export class LampWidget extends Widget {

    static new(state: State) {
        let ins = [TypeShim.new("A", Type.boolean)]
        return new LampWidget("lamp", WidgetSide.Output, Vector2.new(1,1), ins, [], state);
    }

    async run(...args: State[]) {
        this.saveState = args[0];
        return [];
    }

    clone() {
        return LampWidget.new(this.saveState);
    }

}