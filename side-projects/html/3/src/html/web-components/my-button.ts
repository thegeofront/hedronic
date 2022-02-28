import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-button', 
class MyButton extends WebComponent {
    
    static readonly template = Template.html`
        <style>
        p {
            color: green;        
        }
        </style>
        <p><slot></slot></p>
    `;
        
    connectedCallback() {
        this.addFrom(MyButton.template);
    }  

});