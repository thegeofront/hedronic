/**
 * HTML utilities
 * 
 * Notes: 
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/raw
 */

import { PayloadEventType } from "./payload-event";

/**
 * This passthrough function serves as syntax highlighting
 */
export function html(template: TemplateStringsArray, ...args: any[]) {
    return String.raw(template, ...args);
}

/**
 * This passthrough does nothing except syntax highlighting
 */
export function css(template: TemplateStringsArray, ...args: any[]) {
    return String.raw(template, ...args);
}

export namespace HTML {
    export function dispatch<T>(type: PayloadEventType<T>, payload?: T) {
        let event = new CustomEvent<T>(type.name, {
            detail: payload,
            bubbles: true,
            composed: true,
        });
        document.dispatchEvent(event);
    }

    export function listen<T>(type: PayloadEventType<T>, callback: (payload: T, e: CustomEvent) => void) {
        let listener = (e: CustomEvent) => {
            //@ts-ignore
            callback(e.detail, e);
        }
    
        //@ts-ignore
        document.addEventListener(type.name, listener);
    }
}



export namespace Div {
    /**
     * Creates html within a div
     */
    export function html(template: TemplateStringsArray, ...args: any[]) {
        const div = document.createElement("div");
        let str = String.raw(template, ...args);
        div.innerHTML = str;
        return div;
    }
}

export namespace Template {
    
    export function html(template: TemplateStringsArray, ...args: any[]) {
        const temp = document.createElement("template");
        let str = String.raw(template, ...args);
        temp.innerHTML = str;
        return temp;
    }

}