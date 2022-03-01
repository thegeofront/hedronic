import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-right-panel', 
class MyRightPanel extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>

    </style>
    <div>
        <p>The Right Panel</p>
    </div>  
    `;
        
    connectedCallback() {
        this.addFrom(MyRightPanel.template);
    }  
});