import { Template } from "../util";
import { WebComponent } from "../web-component";

function getVersion() {
    return "0.0.3";
}

customElements.define('my-header', 
class MyHeader extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>
        
    .footer

    </style>
    <footer style="display: flex; align-content: end" >
        <p>This is a footer</p>
    </footer>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyHeader.template);
    }  

});