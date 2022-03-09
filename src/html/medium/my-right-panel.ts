import { GeonNode } from "../../nodes-canvas/model/node";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { PayloadEventType } from "../payload-event";
import { Element, Str, Template } from "../util";
import { WebComponent } from "../web-component";

export const showRightPanel = new PayloadEventType<void>("showrightpanel");

export const hideRightPanel = new PayloadEventType<void>("hiderightpanel");

export const setRightPanel = new PayloadEventType<SetRightPanelPayload>("setrightpanel");

export type SetRightPanelPayload = NodesCanvas | GeonNode | GeonNode[];

/**
 * The Right Panel is a properties panel. 
 * It makes sure the user does not have to right-click everything
 */
customElements.define('my-right-panel', 
class MyRightPanel extends WebComponent {
    
    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css">  
    <style>

    * {
        /* background-color: red; */
        border: 5px;
        border-color: red;
    }

    p {
        font-size: 90%;
        color: var(--default-color-3);
        /* font-style: arial; */
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: var(--font-lead);
    }

    code {
        color: var(--accent-color-1);
    }

    span {
        display: flex;
        /* gap: 20px; */
        justify-content: space-between;

    }

    #panel {
        height: var(--main-height);
        background-color: var(--background-color-2);
        border-left: 1px solid var(--background-color-3);
        /* border-right: 1px; */
        padding: 8px;
    }

    .divider {
        border-top: 2px solid var(--background-color-3);
        min-width: 100%;
        min-height: 1px;
        cursor: default;
        padding-top: 8px;
        /* padding-bottom: 6px; */
    }

    </style>
    <div id="panel">
        <h4 id="title" class="pt-3">Canvas</h4>
        <!-- <div class="divider"></div> -->
        <div id="the-body"></div>
    </div>  
    `;
        
    data?: SetRightPanelPayload

    connectedCallback() {
        this.addFrom(MyRightPanel.template);
        this.listen(setRightPanel, this.set.bind(this))
        this.listen(hideRightPanel, this.hide.bind(this))
        this.listen(showRightPanel, this.show.bind(this))
        // this.setDefault();
    }  

    hide() {
        this.style.display = "none";
    }

    show() { 
        this.style.display = "";
    }

    set(data: SetRightPanelPayload) {
        if (!data) return this.setDefault();

        if (data == this.data) {
            return;
        }

        if (data instanceof GeonNode) {
            this.setWithNode(data);
            this.data = data;
            return;
        } 
        if (data instanceof NodesCanvas) {
            this.setWithCanvas(data);
            this.data = data;
            return
        }
        if (data instanceof Array) {
            this.setWithGroup(data);
            this.data = data;
            return;
        }
    }

    setWithCanvas(canvas: NodesCanvas) {
        this.get("title").innerText = "Canvas";
        let body = this.get("the-body");
        body.replaceChildren(
           ...makeCanvasMenu(canvas)
        );
    }

    setWithNode(node: GeonNode) {
        let title = node.process.nameLower || "-";
        let subtitle = node.operation?.path.join(".") || "widget";
        // let content = JSON.stringify(node.operation?.toJson(), null, 2);
        let ops = node.operation;

        let inputHTML = ops?.ins.map((type, i) => {
            let socket = node.inputs[i];
            let connection = socket ? `${socket.hash}[${socket.normalIndex()}]` : "Empty";
            return Str.html`
            <div>
                <h6>${i}</h6>
                <div class="row">
                    <p class="col">name: <code>${type.name}</code></p>
                    <p class="col">type: <code>${type.typeToString()}</code></p>
                </div>
                <p>value:</p>
                <p>con: <code>${connection}</code></p>
            </div>
            <div class="divider"></div>
            `
        }).join("");
        
        let outputHTML = ops?.outs.map((type, i) => {
            let sockets = node.outputs[i];
            let data = "Empty";
            if (sockets.length != 0) {
                data = sockets.map((s) => `${s.hash}[${s.normalIndex()}]`).join(" , ")
            }
            return Str.html`
            <div class="row">
                <p class="col-6">${type.name} [ ${type.typeToString()} ] </p>
                <p class="col-6"><code>${data}</code></p>
            </div>`
        }).join("");

        if (!inputHTML || !outputHTML) {
            inputHTML = "";
            outputHTML = "";
        }

        this.get("title").innerText = "Node";
        this.get("the-body").innerHTML = Str.html`
            <p>name: <code>${title}</code></p>
            <p>path: <code>${subtitle}</code></p>
            <p>hash: <code>${node.hash}</code></p>
            <!-- <div class="row">
                <p class="col">inputs: <code>${ops?.inCount}</code></p>
                <p class="col">outputs: <code>${ops?.outCount}</code></p>
            </div> -->
            <div class="divider"></div>
            <h5>Process</h5>
            <p>took: <code>${"???"}</code>ms</p>
            <div class="divider"></div>
            <h5>Input</h5>
            ${inputHTML}
            <div class="divider"></div>
            <h5>Output</h5>
            ${outputHTML}
            <div class="divider"></div>
        `;
    }

    setWithGroup(nodes: GeonNode[]) {
        let count = nodes.length;
        this.get("title").innerText = `Group (${count})`;
        this.get("the-body").innerHTML = Str.html`
            <p></p>
        `;
    }

    setDefault() {
        this.get("title").innerText = "Geofront";
        this.get("the-body").innerHTML = Str.html`
            <h6>Welcome</h6>
            <p>Welcome to geofront! </p>
            <div class="divider"></div>
        `;
    }
});


function makeCanvasMenu(nodes: NodesCanvas) {
    let elements = [
        makeButton("this is button", () => {console.log("yes hello")}),
        makeEnum(
            "Zoom", 
            ["20", "30", "40"], 
            nodes.getZoom().toString(), 
            (val) => {nodes.setZoom(Number(val))})
    ]
    return elements;
}


function makeButton(name: string, onClick?: (ev: Event) => void) {
    let button = Element.html`<button class="btn btn-sm btn-secondary">${name}</button>`;
    if (onClick) button.onclick = onClick;
    return button;
}


function makeEnum(name: string, ops: string[], def: string, onChange?: (value: string) => void) {
    let enumerator = Element.html`
    <div class="form-group">
        <label for="${name}">${name}</label>
        <select class="form-control" id="${name}">${ops.map(op => 
            Str.html`<option ${op == def ? "selected" : ""} value="${op}">${op}`).join("")
            }
        </select>
    </div>`;

    if (onChange) enumerator.onchange = function (ev: Event) {
        //@ts-ignore
        let value:string = ev.target!.value;
        onChange(value);
    }

    return enumerator;
}