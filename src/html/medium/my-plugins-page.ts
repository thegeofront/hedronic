import { MainTab, MyMain, TabMainEvent } from "../large/my-main";
import { Template } from "../util";
import { WebComponent } from "../web-component";

/**
 * The Right Panel is a properties panel. 
 * It makes sure the user does not have to right-click everything
 */
 customElements.define('my-plugins-page', 
 class MyPluginsPage extends WebComponent {
     
    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css">  
    <style>

    #root {
        /* width: 100%; */
        height: 100%;
        background: var(--background-color-3);
    }

    </style>
    <div id="root">
        <div class="container">
            <h3 class="pt-5">Plugins</h3>
            <table class="table table-dark" style="width: 500px">
            <thead>
                <tr>
                <th scope="col"></th>
                <th scope="col">name</th>
                <th scope="col">url</th>
                <th scope="col">filename</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td><my-small-button>🗑️</my-small-button></td>
                <td>Geofront Additions</td>
                <td><code>./somewhere</code></td>
                <td>geoplus</td>
                </tr>
                <tr>
                <td><my-small-button>🗑️</my-small-button></td>
                <td>Startin</td>
                <td><code>./somewhere</code></td>
                <td>startin</td>
                </tr>                
                <tr>
                <td><my-small-button>🗑️</my-small-button></td>
                <td>CGAL</td>
                <td><code>./somewhere</code></td>
                <td>cgal</td>
                </tr>
            </tbody>
            </table>
            <my-small-button style="background-color: white;"> + </my-small-button>
        </div>
    </div>
    `;
        
    payload?: any

    connectedCallback() {
        this.addFrom(MyPluginsPage.template);
        // this.listen(hideRightPanel, this.hide.bind(this))
        // this.listen(showRightPanel, this.show.bind(this))
    }  

    renderPlugins() {

    }

    // hide() {
    //     this.style.display = "none";
    // }

    // show() { 
    //     this.style.display = "";
    // }
});

