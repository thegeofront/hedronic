import { IO, Vector2 } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";

export class FileSaveStringWidget extends Widget {

    filename = "my-result.obj";
    
    get filecontent() : string | undefined {
        return this.saveState as string || undefined;
    } 

    static new(state: State) {
        let ins = [TypeShim.new("content", JsType.string)]
        return new FileSaveStringWidget("file save string", WidgetSide.Output, Vector2.new(2,2), ins, [], state);
    }

    async run(...args: State[]) {
        this.saveState = args[0];
        return [];
    }

    clone() {
        return FileSaveStringWidget.new(this.saveState);
    }

    makeMenu(): HTMLElement[] {
        return [
            MenuMaker.text("filename", this.filename, (str) => {this.filename = str}),
            MenuMaker.button("Write", this.onClick.bind(this))
        ];
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