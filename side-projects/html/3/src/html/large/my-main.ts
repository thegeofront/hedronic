import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-main', 
class MyMain extends WebComponent {
    
    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css"> 
    <style>
        main {
            background-color: black;
            height: 100%;
        }
/* 
        * {
            margin: 0px;
            padding: 0px;
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