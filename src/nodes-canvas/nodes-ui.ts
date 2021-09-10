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
}


