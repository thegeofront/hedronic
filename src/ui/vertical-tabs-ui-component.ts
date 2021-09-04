export class VerticalTabItem {

    constructor(
        public name: string,
        public icon: string,
        public active: boolean,
        public content: string,
    ) {}

    static new(
        name: string,
        icon: string,
        active: boolean,
        content: string) {
        return new VerticalTabItem(name, icon, active, content);
    }

    toNavHtml() {
        return `<li ${this.active ? `class="active"` : ``}><a href="#${this.name}" data-toggle="tab">
        <i class="bi ${this.icon}"></i>
        ${this.name}
        </a></li>`
    }

    toBodyHtml() {
        return `<div class="tab-pane ${this.active ? `active` : ``}" id="${this.name}">
        ${this.content}
        </div>`
    }
}

export class VerticalTabList {
    
    constructor(public items: VerticalTabItem[]) {}

    static new(items: VerticalTabItem[]) {
        return new VerticalTabList(items);
    }

    toHtml() {
        let nav: string[] = [];
        let body: string[] = [];
        this.items.forEach(item => {
            nav.push(item.toNavHtml());
            body.push(item.toBodyHtml());
        })
        return `
        <div class="vertical-tab">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs">
                ${nav.join('\n')}
            </ul>
            <!-- Tab panes -->
            <div class="tab-content tabs">
                ${body.join('\n')}
            </div>
        </div>`
    }
}