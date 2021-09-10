// author : Jos Feenstra 
// purpose: sort of jquery 


export type ElementType = "div" | "h1" | "h2" | "a" | "p" | "img" | "span"; 

export class DomHead {
    
    constructor() {

    }

    static new() {
        return new DomHead();
    }

    addCss(fileName : string) 
    {
        // add a style sheet to the document
        var head = document.head;
        var link = document.createElement("link");
        
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = fileName;
        link.className = fileName;
        head.appendChild(link);
    }

    removeCss(fileName : string)
    {
        // TODO
        var links = document.querySelectorAll("link")!;
        links.forEach(link => {
            if (link.className == fileName) link.remove();
        });
    }
}

// TODO add some more jquery functionalities
/**
 * A class to write DOM with. 
 * It is created as a hierarchical writer: use `down` and `up` to traverse the DOM. 
 * Almost all methods return `this` to make function chaining easy.
 */
export class DomWriter {

    constructor(
        public cursor: HTMLElement | Document,
    ) {
        
    }

    static new(pointer: HTMLElement | Document = document) {
        return new DomWriter(pointer);
    }

    /**
     * Go a step up the DOM hierachy 
     */
    up() {
        if (this.cursor.parentElement == null) {
            throw new Error("no parent!!");
        }
        this.cursor = this.cursor.parentElement;
        return this;
    }

    /**
     * Go a step down the DOM hierachy 
     */
    down(index = 0) {
        if (index < 0 || index >= this.cursor.childElementCount) {
            throw new Error("index out of range!");
        }
        this.cursor = this.cursor.children.item(index) as HTMLElement;
        return this;
    }

    /**
     * Go a step down the DOM hierachy 
     */
    downFirst() {
        if (this.cursor.firstElementChild == null) {
            throw new Error("no first!!");
        }
        this.cursor = this.cursor.firstElementChild as HTMLElement;
        return this;
    }

    /**
     * Go a step down the DOM hierachy 
     */
    downLast() {
        if (this.cursor.lastElementChild == null) {
            throw new Error("no first!!");
        }
        this.cursor = this.cursor.lastElementChild as HTMLElement;
        return this;
    }

    to(obj: HTMLElement | Document) {
        this.cursor = obj;
        return this;
    }

    toId(id: string) {
        this.cursor = document.getElementById(id)!;
        return this;
    }

    toQuerySelector(selector: string) {
        this.cursor = document.querySelector(selector)! as HTMLElement;
        return this;
    }

    clear() {
        while(this.cursor.firstChild) {
            // let child = element.firstChild as HTMLElement;
            // child.style.animation = 'hide 300ms';
            this.cursor.removeChild(this.cursor.firstChild);
        }
        return this
    }

    attr(attribute: string, value: string) {
        if (this.cursor instanceof Document) {
            throw new Error("not possible with document selected!")
        } 
        this.cursor.setAttribute(attribute, value);
        return this;
    }

    get inner() {
        if (this.cursor instanceof Document) {
            throw new Error("not possible with document selected!")
        } 
        return this.cursor.innerHTML;
    }

    set inner(str: string) {
        if (this.cursor instanceof Document) {
            throw new Error("not possible with document selected!")
        } 
        this.cursor.innerHTML = str;
    }

    get classes() {
        if (this.cursor instanceof Document) {
            throw new Error("not possible with document selected!")
        } 
        return this.cursor.classList;
    }

    // ---- various adders ----

    append(el: HTMLDivElement | HTMLHeadingElement | HTMLAnchorElement | HTMLParagraphElement | HTMLImageElement | HTMLSpanElement) {
        this.cursor.appendChild(el);
        this.downLast();
        return this;
    }

    add(type : ElementType, classes="", content="") {
        let el = document.createElement(type)
        el.innerText = content;
        el.className = classes;
        return this.append(el);
    }

    AddLink(ref="#", inner="link", classes = "") {
        let el = document.createElement("a");
        el.href = ref;
        el.className = classes;
        el.innerHTML = inner;
        return this.append(el);
    }

    AddDiv(classes = "") {
        let el = document.createElement("div");
        el.className = classes;
        return this.append(el);
    }

    AddH1(inner : string, classes = "") {
        let el = document.createElement("h1");
        el.innerText = inner;
        el.className = classes;
        return this.append(el);
    } 

    addH2(message : string, classes : string="") {
        let el = document.createElement("h2");
        el.innerText = message;
        el.className = classes;
        return this.append(el);
    }

    addText(message : string, classes : string = "") {
        let el = document.createElement("p")
        el.className = classes;
        let text = document.createTextNode(message);
        el.appendChild(text);
        return this.append(el);
    }
}

export class Dom {
    constructor(
        public head = DomHead.new(),
        public body = DomWriter.new(),
    ) {}
}

export const dom = new Dom();
