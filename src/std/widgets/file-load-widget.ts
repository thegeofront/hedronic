import { Vector2, WebInput, WebIO } from "../../../../engine/src/lib";
import { MenuMaker } from "../../menu/util/menu-maker";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";
import { State } from "../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../nodes-canvas/model/widget";

export class FileLoadWidget extends Widget {
    
    static new(state: State) {
        let outs = [TypeShim.new("content", Type.string)];
        return new FileLoadWidget("file load", WidgetSide.Input, Vector2.new(2,2), [], outs, state);
    }

    clone() {
        return FileLoadWidget.new(this.saveState);
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
        let data = await WebIO.readFileAsText(files[0]);

        if (data == null) {
            alert("could not process file as text");
            return;  
        } 

        if (data instanceof ArrayBuffer) {
            alert("array buffer processing not implemented (yet)")
            return;
        }

        this.saveState = data;
        this.onChange();
    }   
}