import { Vector2 } from "../../../../engine/src/lib";
import { MainTab, MyMain, TabMainEvent } from "../large/my-main";
import { PayloadEventType } from "../payload-event";
import { Compose, Element, Template } from "../util";
import { WebComponent } from "../web-component";

export type addItemPayload = {node: Node, id: string, x: number, y: number}
export type setItemPayload = {id: string, x: number, y: number}


export const removeOverlayItemEvent = new PayloadEventType<string>("onoffsetCanvas");
export const setOverlayItemEvent = new PayloadEventType<setItemPayload>("onoffsetCanvas");
export const addOverlayItemEvent = new PayloadEventType<addItemPayload>("onoffsetCanvas");
export const offsetOverlayEvent = new PayloadEventType<Vector2>("onoffsetCanvas");
export const scaleOverlayEvent = new PayloadEventType<Vector2>("onoffsetCanvas");

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
    scale = 24;

    connectedCallback() {
        this.addFrom(MyCanvasOverlay.template);
        this.listen(offsetOverlayEvent, this.onMove.bind(this));
        // this.listen(addOverlayItemEvent, this.onAddItem.bind(this));
        // this.listen(setOverlayItemEvent, this.onSetItemPos.bind(this));
        // this.listen(removeOverlayItemEvent, this.onRemoveItem.bind(this));
        this.test()
    }  

    test() {
        this.onAddItem({node: Element.html`henk`, x: 0, y: 1, id: "henk"})
        this.onAddItem({node: Element.html`kaasje`, x: 0, y: 2, id: "kaas"})
        // console.log(this.get("container"));
        this.onChange();
    }

    onAddItem(payload: addItemPayload) {
        let {node, x, y, id} = payload;
        this.get("container").appendChild(
            Compose.html`
            <div class="item" 
                id="${id}"
                data-x="${x.toString()}" 
                data-y="${y.toString()}">
                ${node}
            </div>`);
    }

    onSetItemPos(payload: setItemPayload) {
        let {x, y, id} = payload;
        let item = this.get(id);
        if (!item) return;
        item.setAttribute("data-x", x.toString());
        item.setAttribute("data-y", y.toString());
    }

    onRemoveItem(id: string) {
        this.get(id).remove();
        // this.get("container").removeChild()
    }

    onChange() {
        
        for (let node of this.get("container").childNodes) {
            if (!(node instanceof HTMLElement)) continue;
            let item = node as HTMLElement;
            let x = Number(item.getAttribute("data-x"));
            let y = Number(item.getAttribute("data-y"));

            let pos = Vector2.dummy.set(x,y);
            pos.scale(this.scale).sub(this.offset);

            item.setAttribute("style", `left: ${pos.x}px; top: ${pos.y}px`);
            // item.style.left = `${pos.x }px`;
            // item.style.top = `${pos.y}px`;
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