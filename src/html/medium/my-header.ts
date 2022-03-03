import { Menu } from "../../menu/menu";
import { Catalogue } from "../../modules/catalogue";
import { mapmap } from "../../nodes-canvas/util/misc";
import { PayloadEventType } from "../payload-event";
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
            <!-- <my-button>File</my-button>
            <my-button>Edit</my-button>
            <my-button>Add</my-button>
            <my-button>View</my-button>
            <my-button>Help</my-button> -->
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
        for (let [catName, cat] of menu.actions) {
            let btn = html`<my-button>${catName}</my-button>`;
            str.push(btn);
        }

        let htmlPiece = str.join('\n');
        this.get("action-categories").innerHTML = htmlPiece;
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