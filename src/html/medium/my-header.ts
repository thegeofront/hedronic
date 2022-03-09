import { Debug, Key } from "../../../../engine/src/lib";
import { MenuAction } from "../../menu/logic/menu-action";
import { MenuDivider } from "../../menu/logic/menu-divider";
import { MenuItem } from "../../menu/logic/menu-item";
import { MenuList } from "../../menu/logic/menu-list";
import { MenuToggle } from "../../menu/logic/menu-toggle";
import { Menu } from "../../menu/menu";
import { Catalogue } from "../../modules/catalogue";
import { Dom } from "../../nodes-canvas/util/dom-writer";
import { mapmap } from "../../nodes-canvas/util/misc";
import { PayloadEventType } from "../payload-event";
import { AddRounterEvent } from "../registry";
import { Compose, Element, Str, Template } from "../util";
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
                <h1 id="title" style="font-family: var(--font-lead)">Geofront</h1>
            </div>
        </div>
        <div id="action-categories" class="header-section">
            <!-- Filled Dynamically with the menu -->
        </div>
        <div class="header-section" style="margin-left: auto; margin-right: 1rem">
            <!-- <my-button id="settingsToggle"><bs-gear-icon></bs-gear-icon></my-button> -->
        </div>
    </header>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyHeader.template);
        this.listen(UpdateCatalogueEvent, this.onUpdateCatalogue.bind(this));
        this.listen(UpdateMenuEvent, this.renderMenu.bind(this));
    }  


    renderMenu(menu: Menu) {
        if (!(menu instanceof Menu)) {
            console.error("expect menu...");
            return;
        }

        // get the context we will render into
        let context = this.get("action-categories");
        context.replaceChildren(...menu.render());
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