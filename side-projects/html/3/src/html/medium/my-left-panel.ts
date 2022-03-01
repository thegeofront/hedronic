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

    </style>
    <div id="panel">
        <my-small-button>V</my-small-button>
        <my-small-button>B</my-small-button>
    </div>
    `;
        
    connectedCallback() {
        this.addFrom(MyLeftPanel.template);
    }  
});