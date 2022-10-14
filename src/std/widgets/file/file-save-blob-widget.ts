import { IO, Vector2 } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";

export class FileSaveBlobWidget extends Widget {

    filename = "my-result.las";
    
    get filecontent() : Blob | undefined {
        return this.saveState as Blob || undefined;
    } 

    static new(state: State) {
        let ins = [TypeShim.new("content", JsType.Blob)]
        return new FileSaveBlobWidget("file save blob", WidgetSide.Output, Vector2.new(2,2), ins, [], state);
    }

    async run(...args: State[]) {
        this.saveState = args[0];
        return [];
    }

    clone() {
        return FileSaveBlobWidget.new(this.saveState);
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
            alert("did not receive data!");
            return;
        }
        IO.promptDownload(this.filename, content);
    }
}