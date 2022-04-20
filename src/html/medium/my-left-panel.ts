import { MainTab, MyMain, TabMainEvent } from "../large/my-main";
import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-left-panel', 
class MyLeftPanel extends WebComponent {
    
    static readonly template = Template.html`
    <!-- <link rel="stylesheet" type="text/css" href="./bootstrap.css">   -->
    <!-- <link rel="stylesheet" type="text/css" href="./index.css"/>    -->
    <style>

    /* NOTE: keep this around: https://css-tricks.com/snippets/css/a-guide-to-flexbox/ */
    #panel {
        display: flex;
        flex-direction: column;
        align-items: center; 
        justify-content: flex-end;
        height: 100%;
    }

    my-small-button {
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }

    </style>
    <div id="panel">
        <my-small-button id="show-graph-btn">🔌</my-small-button>
        <my-small-button id="show-viewer-btn">🔎</my-small-button>
        <my-small-button id="show-plugins-btn">📦</my-small-button>
        <!-- <my-small-button id="show-settings-btn">⚙️</my-small-button> -->
    </div>
    `;
        
    connectedCallback() {
        this.addFrom(MyLeftPanel.template);
        this.get("show-graph-btn").addEventListener("click", (e) => this.onToggleMainButtonPressed(MainTab.Graph, e.target));
        this.get("show-viewer-btn").addEventListener("click", (e) => this.onToggleMainButtonPressed(MainTab.Viewer, e.target));
        this.get("show-plugins-btn").addEventListener("click", (e) => this.onToggleMainButtonPressed(MainTab.Plugins, e.target));
        // this.get("show-settings-btn").addEventListener("click", (e) => this.onToggleMainButtonPressed(MainTab.Settings, e.target));
    }  

    onToggleMainButtonPressed(tab: MainTab, btn: any | null) {
        this.dispatch(TabMainEvent, tab);

        // highlight button (sorry for this ugly code)
        if (!btn) return;
        for (let b of this.shadowRoot?.querySelectorAll("my-small-button")!) {
            (b as HTMLElement).style.backgroundColor = "";
        }
        (btn as HTMLElement).style.backgroundColor = "hsl(240, 9%, 38%)";
    }
});