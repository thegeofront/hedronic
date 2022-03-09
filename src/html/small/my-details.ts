import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-details', 
class MyStyler extends WebComponent {
    
    static readonly template = Template.html`
        <style>
        details>summary {
            list-style: none;
        }

        summary::-webkit-details-marker {
            display: none
        }

        summary::before {
            content: '►';
        }

        details[open] summary:before {
            content: "▼";
        }

        </style>
        <details>
            <summary><slot name="title"></slot></summary>
            <slot name="content"></slot>
        </details>
    `;
        
    connectedCallback() {
        this.addFrom(MyStyler.template);
    }  

});