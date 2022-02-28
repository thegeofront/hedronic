import { Template } from "../util";
import { WebComponent } from "../WebComponent";

customElements.define('x-styler', 
class XStyler extends WebComponent {
    
    static readonly template = Template.html`
        <style>
        p {
            color: green;        
        }
        </style>
        <p><slot></slot></p>
    `;
        
    connectedCallback() {
        this.addFrom(XStyler.template);
    }  

});