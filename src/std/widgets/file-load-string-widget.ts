import { Vector2, WebInput, WebIO } from "../../../../engine/src/lib";
import { MenuMaker } from "../../menu/util/menu-maker";
import { TypeShim } from "../../modules/shims/type-shim";
import { JsType } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";

export class FileLoadStringWidget extends Widget {
    
    static new(state: State) {
        let outs = [TypeShim.new("content", JsType.string)];
        return new FileLoadStringWidget("file load as string", WidgetSide.Input, Vector2.new(2,2), [], outs, state);
    }

    clone() {
        return FileLoadStringWidget.new(this.saveState);
    }

    makeMenu(): HTMLElement[] {
        return [MenuMaker.file("file", this.onFilesRecieved.bind(this))];
    }

    onClick() {
        WebInput.askForFile("file", (files: FileList| null) => {
            if (!files) return;
            this.onFilesRecieved(files);
        })
    }

    async onFilesRecieved(files: FileList | undefined) {
        if (!files) return;
        if (files.length == 0) return;

        // for now, just take the first file
        let data = await WebIO.readFileAsString(files[0]);

        if (data == null) {
            alert("could not process file as text");
            return;  
        } 

        this.saveState = data;
        this.onChange();
    }   
}