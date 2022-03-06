import { Key } from "../../../../engine/src/lib";
import { MenuAction } from "../../menu/items/menu-action";
import { MenuDivider } from "../../menu/items/menu-divider";
import { MenuItem } from "../../menu/items/menu-item";
import { MenuList } from "../../menu/items/menu-list";
import { Menu } from "../../menu/menu";
import { Catalogue } from "../../modules/catalogue";
import { mapmap } from "../../nodes-canvas/util/misc";
import { PayloadEventType } from "../payload-event";
import { AddRounterEvent } from "../registry";
import { html, HTML, Template } from "../util";
import { WebComponent } from "../web-component";

export const UpdateCatalogueEvent = new PayloadEventType<Catalogue>("updatecatalogue");

export const UpdateMenuEvent = new PayloadEventType<Menu>("updatemenu");

customElements.define('my-header', 
class MyHeader extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>
        header {
            -webkit-user-select: none; /* Safari */        
            -moz-user-select: none; /* Firefox */
            -ms-user-select: none; /* IE10+/Edge */
            user-select: none; /* Standard */
            width: 100vw;
            height: 100%;
            background-color: var(--background-color-1);
            z-index: -10;
        }

        .header-section {
            /* padding-left: 10px;  */
            margin: 8px; 
            display: flex; 
            align-content: end; 
            align-items: end
        }

        #title {
            padding: 0px; 
            margin: 0px;
            font-weight: 500;
            margin-bottom: -10px;
        }
            
        #subtitle {
            padding: 0px; 
            margin: 0px; 
            color: darkgrey; 
            margin-bottom: -12px;
        }

    </style>
    <header style="display: flex; align-content: end" >
        <!-- title tag -->
        <div style="display: flex; align-items: center">
            <my-logo></my-logo>
            <div>
                <h1 id="title">Geofront</h1>
            </div>
        </div>
        <div id="action-categories" class="header-section">
            <my-button>File</my-button>
            <my-button>Edit</my-button>
            <my-button>Add</my-button>
            <my-button>View</my-button>
            <my-button>Help</my-button>
        </div>
        <div class="header-section" style="margin-left: auto; margin-right: 1rem">
            <my-button>Settings</my-button>
        </div>
    </header>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyHeader.template);
        this.listen(UpdateCatalogueEvent, this.onUpdateCatalogue.bind(this));
        this.listen(UpdateMenuEvent, this.onUpdateMenu.bind(this));
    }  

    onUpdateMenu(menu: Menu) {
        if (!(menu instanceof Menu)) {
            console.error("expect menu...");
            return;
        }

        // generate the needed html
        let str: string[] = [];
        for (let [name, category] of menu.categories) {

            let btn = html`
            <my-dropdown-button>
                <span slot="title">${name}</span>
                <ul slot="list">
                    ${category.map((action) => this.itemToHTML(action)).join('')}
                </ul>
            </my-dropdown-button>`;
            str.push(btn);
        }
        let htmlPiece = str.join('');
        
        // convert to DOM
        let actionsHTML = this.get("action-categories");
        actionsHTML.innerHTML = htmlPiece;

        // add listeners
        for (let dd of this.shadow.querySelectorAll("my-dropdown-button")) {
            
            //@ts-ignore
            // dd.setRouter((a) => {menu.call(a)})
        }
        this.dispatchShadow(AddRounterEvent, menu.call);
    }

    itemToHTML(item: MenuItem) : string {
        if (item instanceof MenuList) {
            return html`
            <li>
                <a>
                    <span class="icon"><my-icon-save></my-icon-save></span>
                    <span class="fill">${item.name}</span>
                    <span class="icon right">➤</span>
                </a>
                <ul>
                    ${item.items.map((action) => this.itemToHTML(action)).join('')}
                </ul>
            </li>`
        }
        if (item instanceof MenuAction) {
            let keys = item.defaultShortcut ? item.defaultShortcut.map((k) => Key[k]).join(" + ") : ""; 
            return html`
            <li>
                <a>
                    <span class="icon">${item.checked ? "✓" : ""}</span>
                    <span class="fill">${item.name}</span>
                    <span class="right">${keys}</span>
                    <span class="icon right"></span>
                </a>
            </li>`
        } 
        if (item instanceof MenuDivider) {
            return html`
                <div></div>
            `
        }
        return "";
    }

    onUpdateCatalogue(catalogue: Catalogue) {
        if (!(catalogue instanceof Catalogue)) {
            console.error("expect catalogue...");
            return;
        }



        console.log("updating catalogue...");
        // catalogue
    }

});