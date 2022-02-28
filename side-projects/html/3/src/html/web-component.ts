/**
 * An in-between class for using Web Components
 * 
 * It tries to do nothing more except abbreviate boilerplate code.
 */
export abstract class WebComponent extends HTMLElement {

    constructor(mode: ShadowRootMode = 'open') {
        super()
        this.attachShadow({ mode });
    }

    addFrom(template: HTMLTemplateElement, deep=true) {
        this.shadowRoot.appendChild(template.content.cloneNode(deep));
    }

    get(id: string) {
        return this.shadowRoot.getElementById(id)
    }

    abstract connectedCallback(): any;

    // attributeChangedCallback

    
}