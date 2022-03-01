import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-screen', 
class MyScreen extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>

    </style>
    <section>
        <my-header></my-header>
        <my-header></my-header>
    <section>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyScreen.template);
    }  

});