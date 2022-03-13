import { Vector2 } from "../../../../engine/src/lib";
import { MainTab, MyMain, TabMainEvent } from "../large/my-main";
import { PayloadEventType } from "../payload-event";
import { Compose, Element, Template } from "../util";
import { WebComponent } from "../web-component";

const offsetCanvasEvent = new PayloadEventType<Vector2>("onoffsetCanvas");

customElements.define('my-canvas-overlay', 
class MyCanvasOverlay extends WebComponent {
    
    static readonly template = Template.html`
    <style>

    .item {
        position: absolute;
    }

    </style>
    <div id="overlay" style="position: absolute; left: 0px; top: 0px">
        <div id="container" style="position: relative">

        </div>
    </div>
    `;
        
    offset = Vector2.new(0,0);
    scale!: number;

    connectedCallback() {
        this.addFrom(MyCanvasOverlay.template);
        this.listen(offsetCanvasEvent, this.onMove.bind(this));
        this.test()
    }  

    test() {
        this.addItem({node: Element.html`henk`, x: 10, y: 10, id: "henk"})
        this.addItem({node: Element.html`kaasje`, x: 10, y: 40, id: "kaas"})
        console.log(this.get("container"));
        // this.onChange();
    }

    addItem(payload: {node: Node, id: string, x: number, y: number}) {
        let {node, x, y, id} = payload;
        this.get("container").appendChild(
            Compose.html`<div class="item" 
                id="${id}"
                data-x="${x.toString()}" 
                data-y="${y.toString()}">
                ${node}
            </div>`);
    }

    setItemPos(payload: {id: string, x: number, y: number}) {
        let {x, y, id} = payload;
        let item = this.get(id);
        if (!item) return;
        item.setAttribute("data-x", x.toString());
        item.setAttribute("data-y", y.toString());
    }

    removeItem(id: string) {
        this.get(id).remove();
        // this.get("container").removeChild()
    }

    onChange() {
        
        for (let node of this.get("container").childNodes) {
            let item = node as HTMLElement;
            
            let x = Number(item.getAttribute("data-x"));
            let y = Number(item.getAttribute("data-y"));
            let pos = Vector2.dummy.set(x,y);
            pos.add(this.offset);

            item.style.top = `${pos.x}px`
            item.style.left = `${pos.y}px`
            console.log("set pos to", )
        }
    }

    /**
     * Called when panning the canvas
     */
    onMove(offset: Vector2) {
        this.offset.copy(offset);
        this.onChange();
    }

    /**
     * called when zooming in and out
     */
    onScale(scale: number) {
        this.scale = scale;
        this.onChange();
    }
});