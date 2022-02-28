import { Div } from "./html/util";
import "./html/web-components/fast-menu-wrapper"
import "./html/web-components/my-counter"
import "./html/web-components/geofront-logo"
import "./html/web-components/x-styler"

function main() {
    
    document.body.append(Div.html`
        <geofront-logo></geofront-logo><h1>Geofront Version ${100}</h1>
        <fast-menu-wrapper></fast-menu-wrapper>
        <progress-bar percent="90"></progress-bar>
        <my-counter></my-counter>
        <x-styler>Text</x-styler>
    `);
}

window.addEventListener("load", main);