import { IO, Parameter, WebIO } from "../../../../engine/src/lib";
import { Str, Compose, Element } from "../../html/util";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";

/**
 * This wraps certain bootstrap menu / form items.
 * With this, we can easely create dynamic menu's
 */
export namespace MenuMaker {
    export function json(json: any) {
        let strs: string[] = []; 
        for (let key in json) {
            strs.push(Str.html`<p>${key}: <code>${json[key]}</code></p>`);
        }
        return strs.join("");
    }
    
    export function button(name: string, onClick: (ev: Event) => void) {
        let button = Element.html`<button class="btn btn-sm btn-dark">${name}</button>`;
        if (onClick) button.onclick = onClick;
        return button;
    }
    
    export function enumerate(name: string, ops: string[], def: string, onChange: (value: string) => void) {
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
    
    export function toggle(name: string, def: boolean, onChange?: (ev: Event) => void) {
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
    
    export function slider(param: Parameter, onChangeCallback?: (p: Parameter) => void, onInputCallback?: (p: Parameter) => void) {
        let slider = Element.html`
        <div class="form">
            <label for="${param.name}" class="form-label">${param.name}</label>
            <input type="range" class="form-range" min="${param.min}" max="${param.max}" step="${param.step}" value="${param.state}" id="${param.name}">
        </div>
        `;
    
        if (onInputCallback) {
            slider.oninput = (ev: Event) => {
                //@ts-ignore
                let value: string = ev.target.value;
                param.set(Number(value)); 
                onInputCallback(param);
            };
        }
    
        if (onChangeCallback) {
            slider.onchange = (ev: Event) => {
                //@ts-ignore
                let value: string = ev.target.value;
                param.set(Number(value)); 
                onChangeCallback(param);
            };
        }
    
        return slider;
    }

    export function textarea(label: string, defaultText: string, callback: (input: string) => void) {
        let el = Element.html`
        <div class="form-group">
           <label for="${label}">${label}</label>
           <textarea class="form-control" rows="5" id="${label}">${defaultText}</textarea>
       </div>
       `;
        
        let comment = el.querySelector(`#${label}`) as HTMLElement;
        // comment.oninput = (e: Event) => {
        //     console.log("change!!!");
        //     let target = e.target as HTMLTextAreaElement
        //     let input = target.textContent || "";
        //     this.setState(input);
        // }
        comment.onkeydown = (ev) => {
            if (ev.code != "Enter") return;
            if (ev.shiftKey || ev.ctrlKey || ev.metaKey) return;
            ev.stopPropagation();
            ev.preventDefault();
            let target = ev.target as HTMLTextAreaElement
            let input = target.value || "";
            callback(input);
        };

        return el;
    }

    /**
     * This requires a bit more work to make useful 
     */
    export function file(label: string, callback: (files?: FileList) => void) {
        let el = Element.html`
        <div class="mb-3">
            <label for="${label}" class="form-label">${label}</label>
            <input class="form-control" type="file" id="${label}" multiple>
        </div>
        `

        let fileHandler = el.querySelector(`#${label}`) as HTMLElement;
        fileHandler.onchange = (e: Event) => {
            let input = e.target as HTMLInputElement
            let files = input.files;
            if (files == null) 
                callback(undefined);
            else 
                callback(files);
        }
        return el;
    }      
}


