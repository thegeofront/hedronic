import { Parameter } from "../../../../engine/src/lib";
import { Str, Compose, Element } from "../../html/util";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";



export function makeButton(name: string, onClick: (ev: Event) => void) {
    let button = Element.html`<button class="btn btn-sm btn-dark">${name}</button>`;
    if (onClick) button.onclick = onClick;
    return button;
}


export function makeEnum(name: string, ops: string[], def: string, onChange: (value: string) => void) {
    let enumerator = Element.html`
    <div class="form-check">
        <label class="form-check-label" for="${name}">${name}</label>
        <select class="form-control dark" id="${name}">${ops.map(op => 
            Str.html`<option ${op == def ? "selected" : ""} value="${op}">${op}`).join("")
        }
        </select>
        
    </div>`;

    if (onChange) enumerator.onchange = function (ev: Event) {
        //@ts-ignore
        let value:string = ev.target!.value;
        onChange(value);
    }

    return enumerator;
}

export function makeToggle(name: string, def: boolean, onChange?: (ev: Event) => void) {
    let toggle = Element.html`
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" ${def ? "checked " : ""} id="${name}">
        <label class="form-check-label" for="${name}">
            ${name}
        </label>
    </div>
    `;
    if (onChange) toggle.onchange = onChange;
    return toggle;
}


export function makeSlider(param: Parameter, callback: (p: Parameter) => void) {
    let slider = Element.html`
    <div class="form">
        <label for="${param.name}" class="form-label">${param.name}</label>
        <input type="range" class="form-range" min="${param.min}" max="${param.max}" step="${param.step}" value="${param.state}" id="${param.name}">
    </div>
    `;
    slider.onchange = (ev: Event) => {
        //@ts-ignore
        let value: string = ev.target.value;
        param.set(Number(value)); 
        callback(param);
    };
    return slider;
}