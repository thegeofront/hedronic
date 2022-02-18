import { FunctionBlueprint } from "../../module-loading/shims/function-shim";
import { NodesCanvas } from "../../nodes-canvas/nodes-canvas";
import { Catalogue, CoreType } from "../../module-loading/catalogue";
import { dom, DomWriter } from "../util/dom-writer";
import { MenuCategory } from "./category";
import { MenuContentMain } from "./category-main";
import { MenuContentOperations as MenuContentModule } from "./category-operators";
import { MenuContentSettings } from "./category-settings";

export class Menu {

    readonly container: HTMLDivElement;
    selected: string;
    categories: MenuCategory[] = [];
    canvas: HTMLCanvasElement;

    constructor(container: HTMLDivElement, canvas: HTMLCanvasElement) {
            this.container = container;
            this.selected = "";
            this.canvas = canvas;
    }

    static new(parent: HTMLDivElement, canvas: HTMLCanvasElement) {
        return new Menu(parent, canvas);
    }

    updateCategories(nodesCanvas: NodesCanvas) {
        this.categories = this.gererateCategories(nodesCanvas);
        this.renderNav();
    }

    private gererateCategories(nodesCanvas: NodesCanvas) {
        let items: MenuCategory[] = [];
        let catalogue = nodesCanvas.catalogue;
        items.push(new MenuCategory("geofront", "bi-globe2", true, new MenuContentMain(nodesCanvas)));

        for (let mod of catalogue.modules.values()) {
            let ops: FunctionBlueprint[] = [];
            for (let op of mod.blueprints.values()) {
                ops.push(op);
            }
            // let content = renderCores(ops, [], onPress)
            items.push(new MenuCategory(mod.name, mod.icon, false, new MenuContentModule(catalogue, mod, this.canvas)));
        }

        items.push(new MenuCategory("settings", "bi-gear", true, new MenuContentSettings()));
        return items;
    }

    renderSelected() {
        
    }

    renderNav() {
        
        let d = dom.body;
        d.to(this.container);
        d.clear();
       
        d.addDiv("container px-0 mx-0").style("width: 60px;'")
            d.addDiv("row")
                d.addDiv("col-12 p-0 d-flex flex-column");
                for(let cat of this.categories) {
                    let f = (ev: Event) => {
                        this.select(cat.name)
                        this.canvas.focus();
                        ev.stopPropagation();
                    }
                    d.addButton(`menu-category ${cat.name}`, f).style("width: 100%; height: 60px");
                        d.addBoostrapIcon(cat.icon).up()
                        d.addText(cat.name).up();
                    d.up()
                }
                d.up();
                    d.addDiv("container category-panel col-6").style("height: max-content;").up()
                d.up();
            d.up()
        d.up();
        
        d.addDiv("overlay")
            d.addText("hello, world!")
                .style("position: absolute; left: 10px; bottom: 10px")
                .up();
        d.up()

        // d.innerHTML = VerticalTabList.new(items).toHtml();
        // b.up();
    }

    
    rerenderNav() {
        // colorize buttons correctly
        let bootstrapHighlightClasses = ["bg-white", "text-danger", "border-danger"];
        let els = this.container.querySelectorAll('.menu-category');
        for (let el of els) {
            if (el.classList.contains(this.selected)) {
                el.classList.add(...bootstrapHighlightClasses);
            } else {
                el.classList.remove(...bootstrapHighlightClasses);
            }
        }
        
        // render the side panel
        let d = dom.body.to(this.container);
        d.toQuery(".category-panel");
        d.clear();
        if (this.selected != "") {
            // d.addDiv("bg-white").style("height: 100%")
            let cat = this.categories.filter((cat) => {
                return cat.name == this.selected})[0];
            cat.content.render(d);
        } 
        

    }

    
    select(name: string) {
        if (name == this.selected) {
            this.selected = "";
        } else {
            this.selected = name;
        }
        this.rerenderNav();
    }
}
