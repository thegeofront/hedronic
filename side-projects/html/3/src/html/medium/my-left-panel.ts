import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-left-panel', 
class MyLeftPanel extends WebComponent {
    
    static readonly template = Template.html`
    <!-- <link rel="stylesheet" type="text/css" href="./bootstrap.css">   -->
    <!-- <link rel="stylesheet" type="text/css" href="./index.css"/>    -->
    <style>

    #panel {
        display: flex;
        height: 100%;
    }

    .group {
        display: inline-block;
        align-self: flex-end;
        position: relative;
        bottom: 0px;
        left: 0px;
    }

    </style>
    <div id="panel">
        <div class="group">
            <my-small-button>V</my-small-button>
            <my-small-button>B</my-small-button>
        </div>
    </div>
    `;
        
    connectedCallback() {
        this.addFrom(MyLeftPanel.template);
    }  
});