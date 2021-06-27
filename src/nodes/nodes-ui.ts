import { UI } from "../../../engine/src/lib";
import { OperationCore } from "../operations/operation";
import { Catalogue } from "../operations/ops-catalogue";

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
    renderCatalogue(catalogue: Catalogue, onPress: (opIdx: number, isGizmo: boolean) => void) {
        let ops = catalogue.ops;
        let giz = catalogue.giz;

        this.ui.clear();

        for (let i = 0 ; i < ops.length; i++) {
            let div = this.ui.addButton(ops[i].name, () => {
                onPress(i, false);
            })
            // div.classList.add("create-node-button");
        }

        for (let i = 0 ; i < giz.length; i++) {
            let div = this.ui.addButton(giz[i].name, () => {
                onPress(i, true);
            })
            div.classList.add("create-gizmo-button-wrapper");
        }
    }
}
