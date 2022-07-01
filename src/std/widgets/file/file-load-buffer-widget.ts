import { Vector2, WebInput, WebIO } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";

export class FileLoadBufferWidget extends Widget {
    
    static new(state: State) {
        let outs = [TypeShim.new("content", JsType.Blob)];
        return new FileLoadBufferWidget("file load as blob", WidgetSide.Input, Vector2.new(2,2), [], outs, state);
    }

    clone() {
        return FileLoadBufferWidget.new(this.saveState);
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
        let buffer = await WebIO.readFileAsBlob(files[0]);
        if (buffer == null) {
            alert("could not process file as blob");
            return;  
        } 
        var uint8View = new Uint8Array(buffer);
        this.saveState = uint8View;
        this.onChange();
    }   
}