import { Element, Str } from "../../html/util";
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

    return [Element.html`
        <div id="node-menu">
            <p>name: <code>${title}</code></p>
            <p>path: <code>${subtitle}</code></p>
            <p>hash: <code>${node.hash}</code></p>
            <!-- <div class="row">
                <p class="col">inputs: <code>${core?.inCount}</code></p>
                <p class="col">outputs: <code>${core?.outCount}</code></p>
            </div> -->
            <div class="divider"></div>
            <h5>Process</h5>
            <p>took: <code>${"???"}</code>ms</p>
            <div class="divider"></div>
            <h5>Inputs</h5>
            ${inputHTML}
            <div class="divider"></div>
            <h5>Outputs</h5>
            ${outputHTML}
            <div class="divider"></div>
        </div>
    `];
}