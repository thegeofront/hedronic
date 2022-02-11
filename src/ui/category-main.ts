import { NodesCanvas } from "../nodes-canvas/nodes-canvas";
import { DomWriter } from "../util/dom-writer";
import { MenuContent } from "./category";

export class MenuContentMain implements MenuContent {
    
    constructor(
        private canvas: NodesCanvas,
    ) {}
    
    render(dom: DomWriter): void {
        dom.addDiv("text-white")
            dom.addButton("button", this.canvas.onNew.bind(this.canvas)).addText("New").up().up();
            dom.addButton("button", this.canvas.onLoad.bind(this.canvas)).addText("Load").up().up();
            dom.addButton("button", this.canvas.onLoadJs.bind(this.canvas)).addText("Load Js").up().up();
            dom.addButton("button", this.canvas.onSave.bind(this.canvas)).addText("Save").up().up();
            dom.addButton("button", this.canvas.onSaveJs.bind(this.canvas)).addText("Save Js").up().up();
        dom.up()
    }

}