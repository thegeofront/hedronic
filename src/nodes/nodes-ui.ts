import { UI } from "../../../engine/src/lib";
import { Operation } from "../operations/operation";
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
    renderCatalogue(catalogue: Catalogue, onPress: (opIdx: number) => void) {
        let ops = catalogue.ops;

        this.ui.clear();

        for (let i = 0 ; i < ops.length; i++) {
            this.ui.addButton(ops[i].name, () => {
                onPress(i);
            })
        }
    }
}
