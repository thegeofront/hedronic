import { Div } from "./html/util";
import "./html/registry.ts";
// LEERMOMENT: maak 1 centrale registry

function main() {
    
    document.body.append(Div.html`
        <my-header></my-header>
    `);
}

window.addEventListener("load", main);