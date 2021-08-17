import { UI } from "../../../engine/src/lib";
import { Operation } from "../graph/operation";
import { Catalogue, CoreType } from "../operations/catalogue";

/**
 * All UI besides the canvas itself
 */
export class NodesSidePanel {

    private constructor(private ui: UI) {

    }

    public static new(context: HTMLDivElement) : NodesSidePanel {

        let ui: UI = UI.new(context);

        return new NodesSidePanel(ui);
    }

    /**
     * Create buttons for each operation
     */
    renderCatalogue(catalogue: Catalogue, onPress: (opIdx: number, type: CoreType) => void) {
        let ops = catalogue.operations;
        let giz = catalogue.widgets;

        this.ui.clear();

        // operations 
        for (let i = 0 ; i < ops.length; i++) {
            let div = this.ui.addButton(ops[i].name, () => {
                onPress(i, CoreType.Operation);
            })
            // div.classList.add("create-node-button");
        }

        // gizmo's
        for (let i = 0 ; i < giz.length; i++) {
            let div = this.ui.addButton(giz[i].name, () => {
                onPress(i, CoreType.Gizmo);
            })
            div.classList.add("create-gizmo-button-wrapper");
        }
    }
}
