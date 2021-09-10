import { Operation } from "../graph/operation";
import { Widget } from "../graph/widget";
import { Catalogue, CoreType } from "../operations/catalogue";
import { DomWriter } from "../util/dom-writer";

type Div = HTMLDivElement;

/**
 * All UI besides the canvas itself
 */
export class NodesSidePanel {

    dom: DomWriter

    private constructor(
        private div: Div
        ) {
        this.dom = DomWriter.new(div);
    }

    public static new(context: Div) : NodesSidePanel {
        return new NodesSidePanel(context);
    }

    renderMainMenu() {

    }


    /**
     * Create buttons for each operation
     */
    renderCatalogue(catalogue: Catalogue, onPress: (opIdx: number, type: CoreType) => void) {
        // this.renderVerticalNav(catalogue, onPress);
        this.dom.clear();
        let ops = catalogue.operations;
        let giz = catalogue.widgets;
        // this.dom.cursor.appendChild(renderCores(ops, giz, onPress));
    }    
}


function renderCores(d: DomWriter, ops: Operation[], wid: Widget[], onPress: (opIdx: number, type: CoreType) => void) {
    
    // operations
    d.add('div', "core-list");

    for (let i = 0 ; i < ops.length; i++) {
        d.addButton("create-node-button", () => {
            onPress(i, CoreType.Operation);
        }).addText(ops[i].name)
        d.up();
    }

    // gizmo's
    for (let i = 0 ; i < wid.length; i++) {
        let div = d.addButton("create-gizmo-button-wrapper", () => {
            onPress(i, CoreType.Widget);
        }).addText(wid[i].name);
        d.up();
    }   
    d.up();
    return d;
}