import { RightMenu } from "../../menu/right-menu";
import { TypeShim } from "../../modules/shims/parameter-shim";
import { GeonNode } from "../../nodes-canvas/model/node";
import { Socket, SocketSide } from "../../nodes-canvas/model/socket";
import { State } from "../../nodes-canvas/model/state";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { PayloadEventType } from "../payload-event";
import { Compose, Element, Str, Template } from "../util";
import { WebComponent } from "../web-component";

export const showRightPanel = new PayloadEventType<void>("showrightpanel");

export const hideRightPanel = new PayloadEventType<void>("hiderightpanel");

export const setRightPanel = new PayloadEventType<SetRightPanelPayload>("setrightpanel");

type Parameter = {state?: State, socket: Socket };

export type SetRightPanelPayload = Parameter | NodesCanvas | GeonNode | GeonNode[];

/**
 * The Right Panel is a properties panel. 
 * It makes sure the user does not have to right-click everything
 */
customElements.define('my-right-panel', 
class MyRightPanel extends WebComponent {
    
    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css">  
    <style>

    p {
        font-size: 90%;
        color: var(--default-color-3);
        /* font-style: arial; */
    }

    h1, h2, h3, h4, h5, h6, b {
        font-family: var(--font-lead);
    }

    code {
        color: var(--accent-color-1);
    }

    span {
        display: flex;
        /* gap: 20px; */
    }

    details {
        border: 1px solid var(--background-color-3);
        padding: 5px;
        border-radius: 2px;
    }

    #panel {
        height: var(--main-height);
        background-color: var(--background-color-2);
        border-left: 1px solid var(--background-color-3);
        /* border-right: 1px; */
        padding: 4px 8px;
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

        if (data.socket.side == SocketSide.Input) {
            this.setWithInput(data);
            this.data = data;
            return;
        }

        if (data.socket.side == SocketSide.Output) {
            this.setWithOutput(data);
            this.data = data;
            return;
        }

        console.warn("side panel cannot draw settings for this data");

        // if (data instanceof Input) {
        //     this.setWithInput(data);
        //     this.data = data;
        //     return;
        // }

        // if (data instanceof Output) {
        //     this.setWithOutput(data);
        //     this.data = data;
        //     return;
        // }
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

        let makeParamEntry = (type: TypeShim, connection: string) => {
            let t = type.typeToString();
            return Str.html`
            <details>
                <summary slot="title"><b>${type.name}: </b><code>${t}</code></summary>
                <p>value:</p>
                <p>con: <code>${connection}</code></p>
            </details>
            `;
        }

        let inputHTML = ops?.ins.map((type, i) => {
            let socket = node.inputs[i];
            let connection = socket ? `${socket.hash}[${socket.normalIndex()}]` : "Empty";
            return makeParamEntry(type, connection);
        }).join("");
        
        let outputHTML = ops?.outs.map((type, i) => {
            let sockets = node.outputs[i];
            let connection = "Empty";
            if (sockets.length != 0) {
                connection = sockets.map((s) => `${s.hash}[${s.normalIndex()}]`).join(" , ")
            }
            return makeParamEntry(type, connection);
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
            <h5>Inputs</h5>
            ${inputHTML}
            <div class="divider"></div>
            <h5>Outputs</h5>
            ${outputHTML}
            <div class="divider"></div>
        `;
    }

    setWithInput(param: Parameter) {
        this.get("title").innerText = "Input";
        this.get("the-body").innerHTML = makeFromJson(param);
    }

    setWithOutput(param: Parameter) {
        this.get("title").innerText = "Output";
        this.get("the-body").innerHTML = makeFromJson(param);
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

function makeFromJson(json: any) {
    let strs: string[] = []; 
    for (let key in json) {
        strs.push(Str.html`<p>${key}: <code>${json[key]}</code></p>`);
    }
    return strs.join("");
}


function makeCanvasMenu(nodes: NodesCanvas) {
    let elements = [
        makeEnum(
            "Zoom", 
            ["24", "32", "48"], 
            nodes.getZoom().toString(), 
            (val) => {nodes.setZoom(Number(val))}),
        makeToggle("preview selection", nodes.settings.previewSelection, () => {nodes.settings.previewSelection = !nodes.settings.previewSelection; nodes.onSelectionChange();}),
    ]
    let html = Compose.html`
    <details>
        <summary><b>details</b></summary>
        ${elements}
    </details>
    `;
    return [html];
}


function makeButton(name: string, onClick: (ev: Event) => void) {
    let button = Element.html`<button class="btn btn-sm btn-secondary">${name}</button>`;
    if (onClick) button.onclick = onClick;
    return button;
}


function makeEnum(name: string, ops: string[], def: string, onChange: (value: string) => void) {
    let enumerator = Element.html`
    <div class="form-check">
        <label class="form-check-label" for="${name}">${name}</label>
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

function makeToggle(name: string, def: boolean, onChange?: (ev: Event) => void) {
    let toggle = Element.html`
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" ${def ? "checked " : ""} id="${name}">
        <label class="form-check-label" for="${name}">
            ${name}
        </label>
    </div>
    `;
    if (onChange) toggle.onchange = onChange;
    return toggle;
}