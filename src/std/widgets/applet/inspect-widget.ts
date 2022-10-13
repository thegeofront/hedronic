import { html } from "../../../html/util";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { State } from "../../../nodes-canvas/model/state";
import { Widget, WidgetSide } from "../../../nodes-canvas/model/widget";
import { InspectWidget } from "../inspect-widget";
import { Element } from "../../../html/util";
import { Vector2, WebInput, WebIO } from "../../../../../engine/src/lib";
import { MenuMaker } from "../../../menu/util/menu-maker";

const domain = window.location.toString().replace("/index.html", "");

function sleep(ms: number) {
    return new Promise(r => setTimeout(r, ms))
}

export class PotreeWidget extends Widget {
 
    dataState: any = undefined;
    applet: any;

    static new(state: State = "http://ahn2.pointclouds.nl/potree_data/tile_all/cloud.js") {
        let outs = [TypeShim.new("points", JsType.Blob)];
        return new PotreeWidget("Load From Potree", WidgetSide.Input, Vector2.new(3,3), [], outs, state);
    }

    clone() {
        return PotreeWidget.new(this.saveState);
    }

    makeMenu(): HTMLElement[] {
        return [
            MenuMaker.textarea("url", this.saveState || "", this.setString.bind(this)),
            MenuMaker.button("Open Potree", this.openPotree.bind(this)),
            MenuMaker.button("Get Points", this.getPoints.bind(this))
        ];
    }

    async setString(str: string) {
        this.saveState = str;
    }

    async openPotree() {

        let message = {
            type: "LoadPointCloud",
            content: this.saveState,
            name: "my-pointcloud"
        }
        this.applet = window.open(domain + "potree-applet/potree.html", "potree", "popup");
        await sleep(1000);
        this.applet.postMessage(message, domain);
    }   

    async getPoints() {

        if (!this.applet) return;
        this.applet.postMessage({type: "GetPoints"}, domain);

        window.addEventListener('message', (e) => {
            this.dataState = e.data;
            this.onChange();
        }, false);
    }  

    async run(...args: State[]) : Promise<State | State[]> {
        return this.dataState; 
    }
}

