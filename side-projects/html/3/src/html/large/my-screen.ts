import { Template } from "../util";
import { WebComponent } from "../web-component";

customElements.define('my-screen', 
class MyScreen extends WebComponent {
    
    static readonly template = Template.html`
    
    <style>

        #screen {
            overflow: hidden;
            display: flex;
            min-height: 100vh;
            flex-direction: column;
        }

        my-header {
            top: 0;
            height: 60px;
        }

        #content {
            flex: 1;
            width:100%;
        }

        /* my-left-panel {
            width: 100px;
            float: left;
        } */

        /* my-main {
            float: auto;
        } */

        /* my-right-panel {
            width: 300px;
            float: right;
            
        } */

        my-footer {
            overflow: hidden;
            left: 0;
            right: 0;
            bottom: 0;
            height: 20px;
        }
        
    </style>
    <section id="screen">
        <my-header></my-header>
        <section class="row" id="content">
            <div class="col-4">
                <p>Left</p>
            </div>
            
            <div class="col-4">
                <p>Center</p>
            </div>
            <div class="col-4">
                <p>Right</p>
            </div>
            <!-- <my-left-panel class="col-4"></my-left-panel>
            <my-main style="width:80%"></my-main>
            <my-right-panel></my-right-panel> -->
        </section>
        <my-footer></my-footer>
    </section>
        
    `;
        
    connectedCallback() {
        this.addFrom(MyScreen.template);
    }  

});