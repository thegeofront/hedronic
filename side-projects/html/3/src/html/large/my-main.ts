import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-main', 
class MyMain extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>
        /* .centered {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        } */
    </style>
    <main id="main">
        <h1>MAIN</h1>
        <p>This is main</p>
    </main>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyMain.template);
    }  

});