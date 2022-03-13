import { Compose, Element, Str } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { GeonNode } from "../../nodes-canvas/model/node";

export function makeMenuFromWidget(node: GeonNode) : Node[] {
    let title = node.core.nameLower || "-";
    let subtitle = "widget!!!";
    // let content = JSON.stringify(node.operation?.toJson(), null, 2);
    let core = node.core;

    let makeParamEntry = (type: TypeShim, connection: string) => {
        let t = type.typeToString();
        return Str.html`
        <details>
            <summary slot="title"><b>${type.name}: </b><code>${t}</code></summary>
            <p>value:</p>
            <p>con: <code>${connection}</code></p>
        </details>
        `;
    }

    let widgetHTML = node.widget!.makeMenu();

    let inputHTML = core.ins.map((type, i) => {
        let socket = node.inputs[i];
        let connection = socket ? `${socket.hash}[${socket.normalIndex()}]` : "Empty";
        return makeParamEntry(type, connection);
    }).join("");
    
    let outputHTML = core.outs.map((type, i) => {
        let sockets = node.outputs[i];
        let connection = "Empty";
        if (sockets.length != 0) {
            connection = sockets.map((s) => `${s.hash}[${s.normalIndex()}]`).join(" , ")
        }
        return makeParamEntry(type, connection);
    }).join("");

    return [Compose.html`
        <div id="node-menu">
            ${Element.html`
            <details open>
                <summary></summary>
                <p>name: <code>${title}</code></p>
                <p>path: <code>${subtitle}</code></p>
                <p>hash: <code>${node.hash}</code></p>
            </details>`}
            <div class="divider"></div>

            <details open>
                <summary>Widget</summary>
                ${widgetHTML}
            </details>
            <div class="divider"></div>

            ${Element.html`
            <details open>
                <summary>Inputs: ${node.core.inCount}</summary>
                ${inputHTML}
            </details>`}
            <div class="divider"></div>

            ${Element.html`
            <details open>
                <summary>Outputs: ${node.core.outCount}</summary>
                ${outputHTML}
            </details>`}
            <div class="divider"></div>

        </div>
    `];
}