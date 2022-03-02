import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-screen', 
class MyScreen extends WebComponent {
    
    static readonly template = Template.html`
    
    <link rel="stylesheet" type="text/css" href="./bootstrap.css">  
    <style>
        
        #screen {
            position: absolute;
            overflow: hidden;
            /* display: flex;
            flex-direction: column; */
            width: 100vw;
            height: 100vh;

            --header-height: 60px;
            --footer-height: 20px;
            --left-width: 30px;
            --right-width: 270px;
            --main-height: calc(100vh - var(--header-height) - var(--footer-height)); 

            left: 0px;
            top: 0px;
        }

        #content {
            position: relative;
            /* top: var(--header-height); */
            /* bottom: var(--footer-height); */
        }

        my-header {
            position: absolute;
            overflow: hidden;
            top: 0;
            height: var(--header-height);
        }

        my-footer {
            position: absolute;
            overflow: hidden;
            bottom: 0;
            max-height: var(---footer-height);
        }

        my-left-panel {
            position: absolute;
            top: var(--header-height);
            width: var(--left-width);
            background-color: var(--background-color-2); 
        } 

        my-main {
            position: absolute;
            left: var(--left-width);
            top: var(--header-height); 
            width: calc(100vw - var(--left-width));
            height: calc(100vh - var(--header-height) - var(--footer-height)); 
            background: green;
        }

        my-right-panel {
            position: absolute;
            top: var(--header-height); 
            right: 0px; 
            width: var(--right-width);
        } 

    </style>
    <section id="screen">
        <my-header></my-header>
        <section id="content">
            <my-left-panel></my-left-panel>
            <my-main></my-main>
            <my-right-panel></my-right-panel>
        </section>
        <my-footer></my-footer>
    </section>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyScreen.template);
    }  

});