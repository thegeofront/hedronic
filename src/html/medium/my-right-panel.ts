import { Type } from "../../modules/shims/parameter-shim";
import { GeonNode } from "../../nodes-canvas/model/node";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { PayloadEventType } from "../payload-event";
import { Str, Template } from "../util";
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
        font-style: arial;
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

        if (data instanceof GeonNode) {
            this.setWithNode(data);
            return;
        } 
        if (data instanceof NodesCanvas) {
            this.setWithCanvas(data);
            return
        }
        if (data instanceof Array) {
            this.setWithGroup(data);
        }
    }

    setWithCanvas(canvas: NodesCanvas) {
        this.get("panel").innerHTML = Str.html`
            <h5 class="pt-3"></h3>
            <p></p>
            <p></p>
        `;
    }

    setWithNode(node: GeonNode) {
        let title = node.process.nameLower || "-";
        let subtitle = node.operation?.path.join(".") || "widget";
        // let content = JSON.stringify(node.operation?.toJson(), null, 2);
        let ops = node.operation;

        let inputHTML = ops?.ins.map((type, i) => {
            let data = node.inputs[i] || "Empty";
            return Str.html`
            <div class="row">
                <p class="col"><code>${data}</code></p>
                <p class="col">${type.name} [ ${type.typeToString()} ] </p>
            </div>`
        }).join("");
        
        let outputHTML = ops?.outs.map((type, i) => {
            let data: any = node.outputs[i];
            if (data.length == 0) {
                data = "Empty";
            }
            return Str.html`
            <div class="row">
                <p class="col">${type.name} [ ${type.typeToString()} ] </p>
                <p class="col"><code>${data}</code></p>
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
            <!-- <div class="row">
                <p class="col">inputs: <code>${ops?.inCount}</code></p>
                <p class="col">outputs: <code>${ops?.outCount}</code></p>
            </div> -->
            <div class="divider"></div>
            <h6>Process</h6>
            <p>took: <code>${"???"}</code>ms</p>
            <div class="divider"></div>
            <h6>Input</h6>
            ${inputHTML}
            <div class="divider"></div>
            <h6>Output</h6>
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