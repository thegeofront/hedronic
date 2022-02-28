import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-button', 
class MyButton extends WebComponent {
    
    static readonly template = Template.html`
        <style>
        p {
            margin: 0px;
        }

        button {
            width: 3.5rem;
            height: 1.5rem;
            border: none;
            border-radius: 2px;
            background-color: transparent;
            color: grey;
        }

        button:hover {
            background-color: white;
            color: var(--background-color-1)
        }

        </style>
        <button id="button"><p><slot>default</slot></p></button>
    `;
        
    connectedCallback() {
        this.addFrom(MyButton.template);
    }  

});