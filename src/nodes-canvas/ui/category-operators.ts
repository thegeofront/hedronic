import { OldFunctionShim } from "../../modules/shims/old-function-shim";
import { Widget } from "../model/widget";
import { CoreType } from "../../modules/catalogue";
import { ModuleShim } from "../../modules/shims/library-shim";
import { DomWriter } from "../util/dom-writer";
import { MenuContent } from "./category";
import { Catalogue } from "../../modules/catalogue";

export class MenuContentOperations implements MenuContent {
    
    constructor(
        private cat: Catalogue, 
        public mod: ModuleShim,
        private canvas: HTMLCanvasElement) {
    }
    
    render(dom: DomWriter): void {
        renderCores(dom, this.mod.blueprints, this.mod.widgets, this.mod.select.bind(this.mod), this.canvas);
    }
}


function renderCores(d: DomWriter, ops: OldFunctionShim[], wid: Widget[], onPress: (opIdx: string, type: CoreType) => void, canvas: HTMLCanvasElement) {
    
    // operations
    d.add('div', "core-list");
    for (let i = 0 ; i < ops.length; i++) {
        d.addButton("create-node-button m-1", () => {
            onPress(ops[i].name, CoreType.Operation);
            canvas.focus();
        }).addText(ops[i].name)
        d.up().up();
    }

    // gizmo's
    for (let i = 0 ; i < wid.length; i++) {
        d.addDiv("create-gizmo-button-wrapper");
        d.addButton("button", () => {
            onPress(wid[i].name, CoreType.Widget);
            canvas.focus();
        }).addText(wid[i].name);
        d.up().up().up();
    }   
    d.up();
    return d;
}