import { IO, Vector2, WebIO } from "../../../../engine/src/lib";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";

export class FileReadWidget extends Widget {
    
    static new(state: State) {
        let outs = [TypeShim.new("content", Type.string)];
        return new FileReadWidget("Read file", WidgetSide.Input, Vector2.new(2,2), [], outs, state);
    }

    run(...args: State[]) : State[] {
        this.state = args[0];
        return [];
    }

    clone() {
        return FileReadWidget.new(this.state);
    }

    // makeMenu(): HTMLElement[] {
    //     return [MenuUtil.makeButton("Read", this.onClick.bind(this))];
    // }

    onClick() {
    }
}