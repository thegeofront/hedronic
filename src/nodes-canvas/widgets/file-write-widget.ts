import { IO, Vector2, WebIO } from "../../../../engine/src/lib";
import { MenuMaker } from "../../menu/util/menu-maker";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../model/state";
import { Widget, WidgetSide } from "../model/widget";

export class FileWriteWidget extends Widget {

    filename = "my-result";
    
    get filecontent() : string | undefined {
        return this.state as string || undefined;
    } 

    static new(state: State) {
        let ins = [TypeShim.new("content", Type.string)]
        return new FileWriteWidget("Write file", WidgetSide.Output, Vector2.new(2,2), ins, [], state);
    }

    run(...args: State[]) : State[] {
        this.state = args[0];
        return [];
    }

    clone() {
        return FileWriteWidget.new(this.state);
    }

    makeMenu(): HTMLElement[] {
        return [MenuMaker.button("Write", this.onClick.bind(this))];
    }

    onClick() {
        let content = this.filecontent;
        if (!content) {
            alert("did not recieve data!");
            return;
        }
        IO.promptDownload(this.filename, content);
    }
}