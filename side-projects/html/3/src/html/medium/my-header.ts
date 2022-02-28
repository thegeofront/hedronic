import { Template } from "../util";
import { WebComponent } from "../web-component";

function getVersion() {
    return "0.0.3";
}

customElements.define('my-header', 
class MyHeader extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>
        header {
            width: 100vw;
            background-color: var(--background-color-1);
        }

        .header-section {
            /* padding-left: 10px;  */
            margin: 8px; 
            display: flex; 
            align-content: end; 
            align-items: end
        }

    </style>
    <header style="display: flex; align-content: end" >
        <!-- title tag -->
        <div style="display: flex; align-items: center">
            <my-logo></my-logo>
            <div style="align-items: middle">
                <h6 style="padding: 0px; margin: 0px; color: darkgrey">Version ${getVersion()}</h6>
                <h1 style="padding: 0px; margin: 0px">Geofront</h1>
            </div>
        </div>
        <div class="header-section">
            <my-button>File</my-button>
            <my-button>Edit</my-button>
            <my-button>Add</my-button>
            <my-button>Help</my-button>
        </div>
        <div class="header-section" style="margin-left: auto; margin-right: 1rem">
            <my-button>Settings</my-button>
        </div>
    </header>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyHeader.template);
    }  

});