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
        <div id="Demo">
            <h1>MAIN</h1>
            <p>This is just some html sample</p>
            <my-dropdown-button>
                <span slot="title">File</span>
              	<ul slot="list">
                    <li>
                        <a>
                            <span class="icon"></span>
                            <span class="fill">Kaas</span>
                            <span class="right"></span>
                            <span class="icon right"></span>
                        </a>
                    </li>
                    <li>
                        <a>
                            <span class="icon">✓</span>
                            <span class="fill">Hallo</span>
                            <span class="right">Ctrl + D</span>
                            <span class="icon right">➤</span>
                        </a>
                        <ul>
                            <li><a>Opossums</a></li>
                            <div></div>
                            <li><a>Numbats, etc.</a></li>
                            <li><a>Bandicoots, etc.</a></li>
                            <li><a>Kangaroos, koalas, wombats, etc.</a></li>
                        </ul>
                    </li>
                </ul>  
            </my-dropdown-button>
        </div>
        <div id="Graph" style="position: relative">
            <my-nodes-canvas></my-nodes-canvas>
            <!-- <my-canvas-overlay></my-canvas-overlay> -->
        </div>
        <div id="Viewer">
            <my-viewer></my-viewer>
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
    Demo="Demo",
    Graph="Graph",
    Viewer="Viewer",
}