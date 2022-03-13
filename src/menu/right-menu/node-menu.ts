import { Element, Str } from "../../html/util";
import { TypeShim } from "../../modules/shims/type-shim";
import { GeonNode } from "../../nodes-canvas/model/node";

export function makeMenuFromNode(node: GeonNode) {
    let title = node.process.nameLower || "-";
    let subtitle = node.operation?.path.join(".") || "widget";
    // let content = JSON.stringify(node.operation?.toJson(), null, 2);
    let ops = node.operation;

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

    let inputHTML = ops?.ins.map((type, i) => {
        let socket = node.inputs[i];
        let connection = socket ? `${socket.hash}[${socket.normalIndex()}]` : "Empty";
        return makeParamEntry(type, connection);
    }).join("");
    
    let outputHTML = ops?.outs.map((type, i) => {
        let sockets = node.outputs[i];
        let connection = "Empty";
        if (sockets.length != 0) {
            connection = sockets.map((s) => `${s.hash}[${s.normalIndex()}]`).join(" , ")
        }
        return makeParamEntry(type, connection);
    }).join("");

    if (!inputHTML || !outputHTML) {
        inputHTML = "";
        outputHTML = "";
    }

    return [Element.html`
        <p>name: <code>${title}</code></p>
        <p>path: <code>${subtitle}</code></p>
        <p>hash: <code>${node.hash}</code></p>
        <!-- <div class="row">
            <p class="col">inputs: <code>${ops?.inCount}</code></p>
            <p class="col">outputs: <code>${ops?.outCount}</code></p>
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
    `];
}