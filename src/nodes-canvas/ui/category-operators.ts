import { Widget } from "../model/widget";
import { CoreType } from "../../modules/catalogue";
import { ModuleShim } from "../../modules/shims/module-shim";
import { DomWriter } from "../util/dom-writer";
import { MenuContent } from "./category";
import { Catalogue } from "../../modules/catalogue";
import { FunctionShim } from "../../modules/shims/function-shim";

export class MenuContentOperations implements MenuContent {
    
    constructor(
        private cat: Catalogue, 
        public mod: ModuleShim,
        private canvas: HTMLCanvasElement) {
    }
    
    render(dom: DomWriter): void {
        
        let f = (cat: Catalogue, opidx: string, type: CoreType) => {
            this.mod.select(opidx, type, cat);
        }
        f.bind(this.mod, this.cat);
        renderCores(dom, this.mod.blueprints, this.mod.widgets, f, this.cat, this.canvas);
    }
}


function renderCores(d: DomWriter, ops: FunctionShim[], wid: Widget[], onPress: (cat: Catalogue, opIdx: string, type: CoreType) => void, cat: Catalogue, canvas: HTMLCanvasElement) {
    
    // operations
    d.add('div', "core-list");
    for (let i = 0 ; i < ops.length; i++) {
        d.addButton("create-node-button m-1", () => {
            onPress(cat, ops[i].name, CoreType.Operation);
            canvas.focus();
        }).addText(ops[i].name)
        d.up().up();
    }

    // gizmo's
    for (let i = 0 ; i < wid.length; i++) {
        d.addDiv("create-gizmo-button-wrapper");
        d.addButton("button", () => {
            onPress(cat, wid[i].name, CoreType.Widget);
            canvas.focus();
        }).addText(wid[i].name);
        d.up().up().up();
    }   
    d.up();
    return d;
}