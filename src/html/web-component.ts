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

    addFrom(template: HTMLTemplateElement, deep=true) {
        this.shadowRoot!.appendChild(template.content.cloneNode(deep));
    }

    get(id: string) {
        let item = this.shadowRoot!.getElementById(id);
        if (!item) {
            console.error(`coudnt find item with id ${item} on the shadowroot`);
        }
        return item!;
    }

    dispatch(type: string, payload: any) {
        let event = new CustomEvent(type, {
            detail: {
                payload: payload,
                bubbles: true,
                composed: true,
            },
        });
        document.dispatchEvent(event);
    }

    listen(type: string, callback: (payload: any, e: CustomEvent) => void) {
        let listener = (e: CustomEvent) => {
            //@ts-ignore
            callback(e.detail.payload, e);
        }
        this.listeners.set(type, listener);

        //@ts-ignore
        document.addEventListener(type, listener);
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

    // attributeChangedCallback

    
}