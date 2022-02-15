import { createRandomGUID, Vector2 } from "../../../../engine/src/lib";
import { Blueprint } from "../blueprints/blueprint";
import { Widget } from "./widget";
import { Socket, SocketIdx } from "./socket";
import { State } from "./state";
import { mapFromJson, mapToJson } from "../util/serializable";
import { CoreType } from "../blueprints/catalogue";

export const NODE_WIDTH = 4;

export class GeonNode {

    errorState = "";

    private constructor(
        public hash: string,
        public position: Vector2, 
        public process: Blueprint | Widget, // slot for an operation
        public inputs: (Socket | undefined)[], // undefined = unconnected node
        public outputs: Socket[][], // empty list == null
        // public cache: State[] = [], // cached outputs 
        ) {}

    get operation() : Blueprint | undefined {
        if (this.process instanceof Blueprint) {
            return this.process as Blueprint
        } else {
            return undefined;
        }
    }

    get widget() : Widget | undefined {
        if (this.process instanceof Widget) {
            return this.process as Widget
        } else {
            return undefined;
        }
    }

    get type() : CoreType {
        if (this.process instanceof Widget) {
            return CoreType.Widget
        } else {
            return CoreType.Operation
        }
    }
    
    static new(gridpos: Vector2, process: Blueprint | Widget, inputs?: (Socket | undefined)[], outputs?: Socket[][], hash = createRandomGUID()) {
        if (process instanceof Widget) {
            // TODO This should not be, this is dumb
            process = process.clone(); // Widgets contain unique state, while Operations are prototypes 
        }

        if (!inputs) {
            inputs = [];
            for (let i = 0 ; i < process.inputs; i++) inputs.push(undefined);
        } else {
            if (inputs.length != process.inputs)
            console.warn("Inadequate number of inputs!")
            return undefined;
        }

        if (!outputs) {
            outputs = [];
            for (let i = 0 ; i < process.outputs; i++) outputs.push([]);
        } else {
            if (outputs.length != process.outputs)
            console.warn("Inadequate number of outputs!")
            return undefined;
        }

        return new GeonNode(hash, gridpos, process, inputs, outputs);
    }

    static fromJson(data: any, process: Blueprint | Widget) {

        let fromJsonOrNull = (s: any) => {s !== 0 ? Socket.fromJson(s) : undefined}

        return GeonNode.new(
            Vector2.new(data.position.x, data.position.y), 
            process,
            data.inputs.map(fromJsonOrNull),
            data.outputs.map((list: any) => list.map(fromJsonOrNull)),
            data.hash,
        )
    }

    static toJson(node: GeonNode) {

        let toJsonOrNull = (s: Socket | undefined) => {s ? s.toJson() : 0}

        return {
            hash: node.hash,
            position: {
                x: node.position.x,
                y: node.position.y,
            },
            type: node.type,
            process: node.process.toJson(),
            inputs: node.inputs.map(toJsonOrNull),
            outputs: node.outputs.map(list => list.map(toJsonOrNull)),
        }
    }

    toJson() {
        return GeonNode.toJson(this);
    }

    run(args: State[]) {
        return this.process.run(args);
    }

    log() {
        console.log(`node at ${this.position}`);
        // this.operation.name
        console.log("operation: ")
        this.process.log();
    }

    // ---- Getters

    getHeight() {
        if (this.type == CoreType.Widget) {
            return this.widget!.size.y;
        } else {
            return Math.max(2, this.process.inputs, this.process.outputs);
        }
    }

    /**
     * 
     */
    getOutputs() : string[] {
        let count = this.process.outputs;
        let sockets: string[] = [];
        for (let i = 0; i < count; i++) {
            let socket = Socket.new(this.hash, i+1);
            // let connections = this.outputs[i];
            sockets.push(socket.toString());
        }
        return sockets;
    }

    /**
     * Get a stringified version of all input sockets
     */
    getInputs() : string[] {
        return this.inputs.map(s => s ? s?.toString() : "");
    }

    // ---- Selection Management

    getConnectorGridPosition(c: SocketIdx) {
        let gp = this.GetComponentLocalGridPosition(c); 
        if (gp === undefined) {
            return undefined;
        }
        return this.position.added(gp);
    }

    GetComponentLocalGridPosition(c: SocketIdx) {
        
        if (c + 1 > -this.process.inputs && c < 0) {
            // input
            let input = (c * -1) - 1;
            return Vector2.new(0, input);
        } else if (c > 0 && c-1 < this.process.outputs) {
            // output 
            let output = c - 1;
            return Vector2.new(NODE_WIDTH-1, output);
        } else {
            return undefined;
        }
    }

    trySelect(gp: Vector2) : number | undefined {
        let height = this.getHeight();
        let local = gp.subbed(this.position);

        // check if we select the widget
        if (this.process instanceof Widget) {
            let result = this.process.trySelect(local);
            if (result) {
                return result;
            }
        }

        // see if this vector lands on an input socket, an output socket, or the body
        if (local.y < 0 || local.y >= height) {
            // quickly return if we dont even come close
            return undefined;
        } else if (local.x == 0) {
            if (local.y < this.process.inputs) {
                return -(local.y + 1) // selected input
            } else {
                return 0; // selected body
            }
        } else if (local.x > 0 && local.x < NODE_WIDTH-1) {
            return 0; // selected body
        } else if (local.x == NODE_WIDTH-1) {
            if (local.y < this.process.outputs) {
                return local.y + 1 // selected output
            } else {
                return 0; // selected body
            }
        }
        return undefined;
    }
}
