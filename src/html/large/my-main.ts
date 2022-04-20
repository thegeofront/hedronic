import { PayloadEventType } from "../payload-event";
import { html, Template } from "../util";
import { WebComponent } from "../web-component";

export class MyMain extends WebComponent {
    
    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css"> 
    <style>
        #root {
            width: 100%;
            height: 100%;
            display: grid;
        }

        div {
            grid-column: 1;
            grid-row: 1;
        }

        #Viewer {
            z-index: -1;
        }

    </style>
    <main id="root">
        
        <div id="Graph" style="position: relative">
            <my-nodes-canvas></my-nodes-canvas>
            <!-- <my-canvas-overlay></my-canvas-overlay> -->
        </div>
        <div id="Viewer">
            <my-viewer></my-viewer>
        </div>
        <div id="Plugins">
            <my-plugins-page></my-plugins-page>
        </div>
        <div id="Settings">
            <h3>Settings</h3>
        </div>
    </main>
        
    `;
        
    constructor(
        private currentTab: MainTab = MainTab.Graph,
    ) {
        super();
    }
    
    connectedCallback() {
        this.addFrom(MyMain.template);
        this.doTab(this.currentTab);
        this.listen(TabMainEvent, this.doTab.bind(this))
        window.addEventListener("resize", this.resize.bind(this))
    }  

    resize() {

    }

    doTab(selected: MainTab) {
        for (let option in MainTab) {

            // always render viewer in background
            if (option == MainTab.Viewer) continue;

            //@ts-ignore
            let tab = MainTab[option] as string;
            if (tab == selected) {
                this.get(tab).style.display = "";
            } else {
                this.get(tab).style.display = "none";
            }
        }
    }
}

customElements.define('my-main', MyMain);

export const TabMainEvent = new PayloadEventType<MainTab>("tabmain");

export const CanvasResizeEvent = new PayloadEventType<any>("canvasresize");

export enum MainTab {
    Plugins="Plugins",
    Settings="Settings",
    Graph="Graph",
    Viewer="Viewer",
}