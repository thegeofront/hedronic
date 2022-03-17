import { makeCanvasMenu } from "../../menu/right-menu/canvas-menu";
import { makeMenuFromNode } from "../../menu/right-menu/node-menu";
import { makeMenuFromWidget } from "../../menu/right-menu/widget-menu";
import { TypeShim } from "../../modules/shims/type-shim";
import { GeonNode } from "../../nodes-canvas/model/node";
import { Socket, SocketSide } from "../../nodes-canvas/model/socket";
import { State } from "../../nodes-canvas/model/state";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { PayloadEventType } from "../payload-event";
import { Compose, Element, Str, Template } from "../util";
import { WebComponent } from "../web-component";
import { Core, CoreType } from "../../nodes-canvas/model/core";
import { MenuMaker } from "../../menu/util/menu-maker";


export const showRightPanel = new PayloadEventType<void>("showrightpanel");

export const hideRightPanel = new PayloadEventType<void>("hiderightpanel");

export const setRightPanelOld = new PayloadEventType<SetRightPanelPayload>("setrightpanel");

export const setMenu = new PayloadEventType<SetMenuPayload>("setmenu");

export type SetMenuPayload = {title: string, data: any, callback: (data: any) => Node[]}

type Payload = {state?: State, socket: Socket };

type GeonNodePayload = {node: GeonNode, nodes: NodesCanvas}

export type SetRightPanelPayload = Payload | NodesCanvas | GeonNode[];

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

    /* details {
        border: 1px solid var(--background-color-3);
        padding: 5px;
        border-radius: 2px;
    } */

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
        <div id="menu-body"></div>
    </div>  
    `;
        
    payload?: any

    connectedCallback() {
        this.addFrom(MyRightPanel.template);
        this.listen(setRightPanelOld, this.set.bind(this))
        this.listen(setMenu, this.setMenu.bind(this))
        this.listen(hideRightPanel, this.hide.bind(this))
        this.listen(showRightPanel, this.show.bind(this))
    }  

    hide() {
        this.style.display = "none";
    }

    show() { 
        this.style.display = "";
    }

    setMenu(payload: SetMenuPayload) {
        
        // cache, dont rerender if not needed 
        if (!payload) return this.setDefault();
        if (payload == this.payload) {
            console.log("same");
            return;
        }
        this.payload = payload;

        // set it
        this.get("title").innerText = payload.title;
        let body = this.get("menu-body");
        body.replaceChildren(
           ...payload.callback(payload.data)
        );
    }

    set(payload: SetRightPanelPayload) {

        // TODO abstract this router in some way

        if (!payload) return this.setDefault();

        if (payload == this.payload) {
            return;
        }
        
        if (payload instanceof NodesCanvas) {
            this.setWithCanvas(payload);
            this.payload = payload;
            return
        }

        if (payload instanceof Array) {
            this.setWithGroup(payload);
            this.payload = payload;
            return;
        }

        if (payload.socket.side == SocketSide.Input) {
            this.setWithInput(payload);
            this.payload = payload;
            return;
        }

        if (payload.socket.side == SocketSide.Output) {
            this.setWithOutput(payload);
            this.payload = payload;
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
        this.get("menu-body").replaceChildren(
           ...makeCanvasMenu(canvas)
        );
    }

    setWithWidget(node: GeonNode) {
        this.get("title").innerText = "Node";
        this.get("menu-body").replaceChildren(
            ...makeMenuFromWidget(node)
         );
    }

    setWithInput(param: Payload) {
        this.get("title").innerText = "Input";
        this.get("menu-body").innerHTML = MenuMaker.json(param);
    }

    setWithOutput(param: Payload) {
        this.get("title").innerText = "Output";
        this.get("menu-body").innerHTML = MenuMaker.json(param);
    }


    setWithGroup(nodes: GeonNode[]) {
        let count = nodes.length;
        this.get("title").innerText = `Group (${count})`;
        this.get("menu-body").innerHTML = Str.html`
            <p></p>
        `;
    }

    setDefault() {
        this.get("title").innerText = "Geofront";
        this.get("menu-body").innerHTML = Str.html`
            <h6>Welcome</h6>
            <p>Welcome to geofront! </p>
            <div class="divider"></div>
        `;
    }
});

