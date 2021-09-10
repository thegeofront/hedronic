import { Operation } from "../graph/operation";
import { Widget } from "../graph/widget";
import { CoreType } from "../operations/catalogue";
import { NodesModule } from "../operations/module";
import { DomWriter } from "../util/dom-writer";
import { MenuContent } from "./category";
import { Catalogue } from "./../operations/catalogue";

export class MenuContentOperations implements MenuContent {
    
    constructor(
        private cat: Catalogue, 
        public mod: NodesModule) {
    }
    
    render(dom: DomWriter): void {
        renderCores(dom, this.mod.getAll(), [], this.mod.select.bind(this.mod));
    }

}


function renderCores(d: DomWriter, ops: Operation[], wid: Widget[], onPress: (opIdx: string, type: CoreType) => void) {
    
    // operations
    d.add('div', "core-list");

    for (let i = 0 ; i < ops.length; i++) {
        d.addButton("create-node-button m-1", () => {
            onPress(ops[i].name, CoreType.Operation);
        }).addText(ops[i].name)
        d.up().up();
    }

    // gizmo's
    for (let i = 0 ; i < wid.length; i++) {
        let div = d.addButton("create-gizmo-button-wrapper", () => {
            onPress(ops[i].name, CoreType.Widget);
        }).addText(wid[i].name);
        d.up();
    }   
    d.up();
    return d;
}