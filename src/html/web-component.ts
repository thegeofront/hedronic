import { PayloadEventType } from "./payload-event";

/**
 * An in-between class for using Web Components
 * 
 * It tries to do nothing more except abbreviate boilerplate code.
 */
type Listener = (e: CustomEvent) => void;

export abstract class WebComponent extends HTMLElement {

    listeners = new Map<string, Listener>();

    constructor(mode: ShadowRootMode = 'open') {
        super()
        this.attachShadow({ mode });
    }

    get shadow() {
        return this.shadowRoot!;
    }

    addFrom(template: HTMLTemplateElement, deep=true) {
        this.shadowRoot!.appendChild(template.content.cloneNode(deep));
    }

    get(id: string) {
        let item = this.shadowRoot!.getElementById(id);
        if (!item) {
            console.error(this, `coudnt find item with id ${item} on the shadowroot`);
        }
        return item!;
    }


    dispatch<T>(type: PayloadEventType<T>, payload: T) {
        let event = new CustomEvent<T>(type.name, {
            detail: payload,
            bubbles: true,
            composed: true,
        });
        document.dispatchEvent(event);
    }

    listen<T>(type: PayloadEventType<T>, callback: (payload: T, e: CustomEvent<T>) => void) {
        let listener = (e: CustomEvent<T>) => {
            
            //@ts-ignore
            callback(e.detail, e);
        }
        this.listeners.set(type.name, listener);

        //@ts-ignore
        document.addEventListener(type.name, listener);
    }

    abstract connectedCallback(): any;

    /**
     * TODO test this...
     */
    unconnectedCallback() {
        console.log("unconnect!!");
        for (let [type, listener] of this.listeners.entries()) {
            //@ts-ignore
            document.removeEventListener(type, listener);
        }
    }

    // static get observedAttributes() {
    //     return ['value', 'max'];
    //   }
      
    // attributeChangedCallback

    
}