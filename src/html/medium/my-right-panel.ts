import { Template } from "../util";
import { WebComponent } from "../web-component";

export const hideRightPanel = "hiderightpanel";
export const showRightPanel = "showrightpanel";
export type ShowRightPanelPayload = {title: string, subtitle: string, content: string};

customElements.define('my-right-panel', 
class MyRightPanel extends WebComponent {
    
    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css">  
    <style>
        * {
            /* background-color: red; */
            border: 5px;
            border-color: red;
        }
        #panel {
            height: var(--main-height);
            background-color: var(--background-color-2)
        }

    </style>
    <div id="panel"> 
        <h3 id="header" class="pt-3">Settings</h3>
        <p id="subheader">The Right Panel</p>
        <p id="body">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolorem eaque iusto asperiores recusandae voluptatum aspernatur totam molestiae obcaecati esse eveniet sapiente id, odit laborum culpa possimus officia natus adipisci ipsa ratione? Obcaecati temporibus dignissimos laborum tenetur excepturi optio sapiente, officia autem eius necessitatibus ipsa deleniti maxime? Est aliquam nihil adipisci!</p>
    </div>  
    `;
        
    connectedCallback() {
        this.addFrom(MyRightPanel.template);
        this.hide();
        this.listen(showRightPanel, this.show.bind(this))
        this.listen(hideRightPanel, this.hide.bind(this))
    }  

    hide() {
        // if (!this.parentElement) {
        //     return;
        // }
        this.style.display = "none";
    }

    show(payload?: any) {
        
        // HIGHJACK
        return;
        if (!payload) {
            return;
        }
        let message = payload as ShowRightPanelPayload;
        this.style.display = "";
        this.get("header").innerText = message.title;
        this.get("subheader").innerText = message.subtitle;
        this.get("body").innerHTML = message.content;
    }
});