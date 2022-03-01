import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-left-panel', 
class MyLeftPanel extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>

    </style>
    <div>
        <p>My Left Panel</p>
    </div>
    `;
        
    connectedCallback() {
        this.addFrom(MyLeftPanel.template);
    }  
});