import { Model, Util } from "../../../../engine/src/lib";
import { Catalogue } from "../../modules/catalogue";
import { ModuleMetaData, ModuleSource } from "../../modules/shims/module-meta-data";
import { MainTab, MyMain, TabMainEvent } from "../large/my-main";
import { PayloadEventType } from "../payload-event";
import { Compose, HTML, Template, Element, Str } from "../util";
import { WebComponent } from "../web-component";

export const UpdatePluginsEvent = new PayloadEventType<Catalogue>("updateplugins");


/**
 * The Right Panel is a properties panel. 
 * It makes sure the user does not have to right-click everything
 */
 customElements.define('my-plugins-page', 
 class MyPluginsPage extends WebComponent {
    
    catalogue: Catalogue | undefined;

    static readonly template = Template.html`
    <link rel="stylesheet" type="text/css" href="./bootstrap.css">   
    <style>

    a {
        color: red;
        text-decoration: none; /* no underline */
    }

    td {
        color: lightgray;
    }

    a:hover {
        color: red;
        text-decoration: underline; /* no underline */
    }

    #root {
        /* width: 100%; */
        height: 100%;
        background: var(--background-color-3);
    }

    .table {
        width: calc(100vw - 500px);
    }

    </style>
    <div id="root">
        <div class="container">
            <h3 class="pt-5">Plugins</h3>
            <table class="table table-dark mr-5">
            <thead id="table-head">
                <tr>
                <th scope="col"></th>
                <th scope="col">url</th>
                <th scope="col">name</th>
                <th scope="col">nickname</th>
                <th scope="col">version</th>
                </tr>
            </thead>
            <tbody id="table-body">
            </tbody>
            </table>
        </div>
        <div class="container">
            <h6 class="pt-2">Add</h6>
            <form class="" novalidate>
                <div class="form-row">
                    <div class="col-md-3 mb-3">
                        <label for="url-field">Url</label>
                        <input type="text" class="form-control" id="url-field" placeholder="https://cdn.jsdelivr.net/npm/geofront/" required>
                        <div class="invalid-tooltip">
                            Please provide a valid Url.
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="name-field">Name</label>
                        <input type="text" class="form-control" id="name-field" placeholder="">
                        <div class="invalid-tooltip">
                            Please provide a valid Name.
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="nickname-field">Nickname</label>
                        <input type="text" class="form-control" id="nickname-field" placeholder="">
                        <div class="invalid-tooltip">
                            Please provide a valid Nickname.
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <label for="version-field">Version</label>
                        <input type="text" class="form-control" id="version-field" placeholder="latest">
                        <div class="invalid-tooltip">
                            Please provide a valid Version.
                        </div>
                    </div>
                </div>
                <my-small-button id="submit-button" type="submit" style="background-color: white;"> + </my-small-button>
                </form>
            </table>
        </div>
    </div>
    `;
        
    payload?: any

    connectedCallback() {
        this.addFrom(MyPluginsPage.template);
        this.listen(UpdatePluginsEvent, this.renderPlugins.bind(this));
        this.get("submit-button").addEventListener("click", this.onSubmit.bind(this));
        // this.listen(hideRightPanel, this.hide.bind(this))
        // this.listen(showRightPanel, this.show.bind(this))
    }  

    onSubmit() {
        const url = (this.get("url-field") as HTMLInputElement).value;
        const name = (this.get("name-field") as HTMLInputElement).value;
        const version = (this.get("version-field") as HTMLInputElement).value;
        const nickname = (this.get("nickname-field") as HTMLInputElement).value;
        const success = window.nodes.addModule(url, nickname, name, version);
        // add module will call render plugins!;
    }

    onDelete(key: string) {
        window.nodes.deleteModule(key); // will rerender plugins!
    }

    renderPlugins() {
        let cat = window.nodes.catalogue;

        // TODO fill the head
        let head = this.get("table-head");

        // fill the body
        let body = this.get("table-body");
        let renderItem = (meta: ModuleMetaData, key: string) => {
            return Str.html`<tr>
                <td><my-small-button id="delete-${key}">🗑️</my-small-button></td>
                <td><a href="${meta.url}"><code>${meta.url}</code></a></td>
                <td>${meta.fullname}</td>
                <td>${meta.nickname}</td>
                <td>${meta.version ? meta.version : "(latest)"}</td>
            </tr>`
        }
        let frags: string[] = [];
        let count = 0;
        cat.modules.forEach((mod, key) => {
            if (mod.meta.source == ModuleSource.Custom) return; 
            frags.push(renderItem(mod.meta, key));
            count++;
        })
        body.innerHTML = frags.join("");

        window.setTimeout(() => {
            cat.modules.forEach((mod, key) => {
                if (mod.meta.source == ModuleSource.Custom) return; 
                let item = this.shadowRoot?.querySelector(`#delete-${key}`);
                if (item == null) return;
                item.addEventListener("click", (_) => this.onDelete(key))
            })
        }, 1000);
    }

    // hide() {
    //     this.style.display = "none";
    // }

    // show() { 
    //     this.style.display = "";
    // }
});

