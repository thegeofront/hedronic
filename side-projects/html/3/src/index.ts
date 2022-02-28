import { Div } from "./html/util";
import "./html/web-components/fast-menu-wrapper"
import "./html/web-components/my-counter"
import "./html/web-components/geofront-logo"
import "./html/web-components/x-styler"

function getVersion() {
    return "0.0.3";
}

function main() {
    
    document.body.append(Div.html`

        <div style="display: flex; align-items: center">
            <geofront-logo></geofront-logo>
            <div style="align-items: middle">
                <h6 style="padding: 0px; margin: 0px; color: darkgrey">Version ${getVersion()}</h6>
                <h1 style="padding: 0px; margin: 0px">Geofront</h1>
            </div>
        </div>
        <fast-menu-wrapper></fast-menu-wrapper>
        <progress-bar percent="90"></progress-bar>
        <my-counter></my-counter>
        <x-styler>Text</x-styler>


    `);
}

window.addEventListener("load", main);