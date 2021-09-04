import { UI } from "../../../engine/src/lib";
import { Operation } from "../graph/operation";
import { Widget } from "../graph/widget";
import { Catalogue, CoreType } from "../operations/catalogue";
import { VerticalTabItem, VerticalTabList } from "../ui/vertical-tabs-ui-component";

type Div = HTMLDivElement;

/**
 * All UI besides the canvas itself
 */
export class NodesSidePanel {

    private constructor(private div: Div) {
        UI
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

        // let cat = renderVerticalNav(catalogue, onPress);

        let ops = catalogue.operations;
        let giz = catalogue.widgets;
        this.div.innerHTML = "";
        // this.div.appendChild(cat);
        this.div.appendChild(renderCores(ops, giz, onPress));
    }    
}

function renderVerticalNav(catalogue: Catalogue, onPress: (opIdx: number, type: CoreType) => void) {
    let host: Div = renderDiv("catalogue");

    let items: VerticalTabItem[] = [];
    items.push(VerticalTabItem.new("geon", "", true, "new | load | save | settings"));

    for (let mod of catalogue.modules.values()) {
        let ops: Operation[] = [];
        for (let op of mod.operations.values()) {
            ops.push(op);
        }
        // let content = renderCores(ops, [], onPress)
        items.push(VerticalTabItem.new(mod.name, "", false, mod.name));
    }

    host.innerHTML = VerticalTabList.new(items).toHtml();
    return host;
}



function renderCores(ops: Operation[], wid: Widget[], onPress: (opIdx: number, type: CoreType) => void) {
    // operations
    let host: Div = renderDiv("core-list");

    for (let i = 0 ; i < ops.length; i++) {
        let div = renderButton(ops[i].name, () => {
            onPress(i, CoreType.Operation);
        })
        div.classList.add("create-node-button");
        host.appendChild(div);
    }

    // gizmo's
    for (let i = 0 ; i < wid.length; i++) {
        let div = renderButton(wid[i].name, () => {
            onPress(i, CoreType.Widget);
        })
        div.classList.add("create-gizmo-button-wrapper");
        host.appendChild(div);
    }   
    return host;
}

function renderButton(name: string, callback: () => void) {
    let button = renderElement("button", "control-button");
    button.innerText = name;
    button.addEventListener("click", callback);

    let text1 = renderElement("p", "control-text");
    let control = renderDiv("control", [text1, button]);
    return control;   
}


function renderElement(element: string, className: string = ""): HTMLElement {
    let el = document.createElement(element);
    el.className = className;
    return el;
}

function renderDiv(classname: string, items: HTMLElement[] = []): HTMLDivElement {
    let div = renderElement("div", classname) as HTMLDivElement;
    items.forEach((item) => {
        div.appendChild(item);
    });
    return div;
}