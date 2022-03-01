import "./html/registry";
import { html } from "./html/util";

async function main() {
    document.body.innerHTML = html`<my-screen></my-screen>`
}

window.addEventListener("load", main, false);