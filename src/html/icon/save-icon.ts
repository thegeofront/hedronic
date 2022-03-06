import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-icon-save', 
class MyIconSave extends WebComponent {
    
    static template = Template.html`
        <style>
        svg {
            position: relative;
            top: 0.125em;
            display: inline-block;
            height:1em;
            width:1em;
        }

        /* .svg-icon {
            display: inline-flex;
            align-self: center;
        } */


        /* .svg-icon.svg-baseline svg {
            top: .125em;
            position: relative;
        } */

        </style>
        <div class="svg-icon">
        <svg xmlns="http://www.w3.org/2000/svg" 
            height="24px" viewBox="0 0 24 24" 
            width="24px" fill="#ffffff">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
        </svg>
        </div>
        `;
        
    connectedCallback() {
        this.addFrom(MyIconSave.template);
    }  
});