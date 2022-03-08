import { GeonNode } from "../../nodes-canvas/model/node";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { PayloadEventType } from "../payload-event";
import { Str, Template } from "../util";
import { WebComponent } from "../web-component";

export const showRightPanel = new PayloadEventType<void>("showrightpanel");

export const hideRightPanel = new PayloadEventType<void>("hiderightpanel");

export const setRightPanel = new PayloadEventType<SetRightPanelPayload>("setrightpanel");

export type SetRightPanelPayload = NodesCanvas | GeonNode;

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
        margin-bottom: 4px;
    }

    </style>
    <div id="panel">
        <h5 id="title" class="pt-3">Canvas</h3>
        <div class="divider"></div>
        <div id="the-body"></div>
        <div class="divider"></div>
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
        } 
        if (data instanceof NodesCanvas) {
            this.setWithCanvas(data);
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
        let content = JSON.stringify(node.operation?.toJson(), null, 2);


        this.get("title").innerText = "Node";
        this.get("the-body").innerHTML = Str.html`
            <p>name: ${title}</p>
            <p>path: ${subtitle}</p>
            <p><code>${content}</code></p>
        `;
    }

    setWithGroup(nodes: GeonNode[]) {
        this.get("title").innerText = "Group";
    }

    setDefault() {
        this.get("title").innerText = "Default";
        this.get("the-body").innerHTML = Str.html`
            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. 
                Dolorem eaque iusto asperiores recusandae voluptatum aspernatur totam
                molestiae obcaecati esse eveniet sapiente id, odit laborum culpa 
                possimus officia natus adipisci ipsa ratione? Obcaecati temporibus 
                dignissimos laborum tenetur excepturi optio sapiente, officia autem 
                eius necessitatibus ipsa deleniti maxime? Est aliquam nihil 
                adipisci!</p>
        `;
    }
});