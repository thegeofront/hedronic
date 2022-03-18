import { createRandomGUID, Vector2 } from "../../../../engine/src/lib";
import { Widget } from "./widget";
import { Socket, SocketIdx, SocketSide } from "./socket";
import { State } from "./state";
import { mapFromJson, mapToJson } from "../util/serializable";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Core, CoreType } from "../../nodes-canvas/model/core";
import { Cable, CableStyle } from "./cable";
import { CableDeleteAction } from "./actions/cable-delete-action";


export const NODE_WIDTH = 4;

export class GeonNode {

    errorState = "";

    private constructor(
        public hash: string,                   // guid or some other unique identifier to this node 
        public position: Vector2,              // position on the canvas, in grid space
        public core: FunctionShim | Widget,    // the process this node represents. Can be an operation or a widget
        public inputs: (Socket | undefined)[], // our inputs : References to the outputs of other nodes we are connected to
        public outputs: Socket[][],            // our outputs: References to the inputs of other nodes we are connected to. One output can feed multiple components  
        public datums: Cable[],
        ) {}

    get operation() : FunctionShim | undefined {
        if (this.core instanceof FunctionShim) {
            return this.core as FunctionShim;
        } else {
            return undefined;
        }
    }

    get widget() : Widget | undefined {
        if (this.core instanceof Widget) {
            return this.core as Widget;
        } else {
            return undefined;
        }
    }

    get type() : CoreType {
        if (this.core instanceof Widget) {
            return CoreType.Widget;
        } else {
            return CoreType.Operation;
        }
    }
    
    static new(
        gridpos: Vector2, 
        process: FunctionShim | Widget, 
        inputs?: (Socket | undefined)[], 
        outputs?: Socket[][], 
        hash = createRandomGUID().substring(0, 13)) {

        if (process instanceof Widget) {
            // TODO This should not be, this is dumb
            process = process.clone(); // Widgets contain unique state, while Operations are prototypes 
        }

        if (!inputs) {
            inputs = [];
            for (let i = 0 ; i < process.inCount; i++) inputs.push(undefined);
        } else {
            if (inputs.length != process.inCount) {
                throw new Error("Inadecuate number of inputs!");
            }
        }

        if (!outputs) {
            outputs = [];
            for (let i = 0 ; i < process.outCount; i++) {
                outputs.push([]);
            } 
        } else {
            if (outputs.length != process.outCount) {
                throw new Error("Inadecuate number of outputs!");
            }
        }

        let cables = []
        for (let i = 0 ; i < process.outCount; i++) {
            let cable = Cable.new(process.outs[i].deepcopy());
            cables.push(cable);
        } 

        return new GeonNode(hash, gridpos, process, inputs, outputs, cables);
    }

    static fromJson(data: any, process: FunctionShim | Widget) {

        // console.log(data);

        let fromJsonOrNull = (s: any) => {
            if (s !== 0) 
                return Socket.fromJson(s);
            return undefined;
        }

        let mappedInputs = data.inputs.map(fromJsonOrNull);
        let mappedOutputs = data.outputs.map((list: any) => list.map(fromJsonOrNull));

        return GeonNode.new(
            Vector2.new(data.position.x, data.position.y), 
            process,
            mappedInputs,
            mappedOutputs,
            data.hash,
        );  
    }

    static toJson(node: GeonNode) {

        let toJsonOrNull = (s: Socket | undefined) => s ? s.toJson() : 0;
    
        return {
            hash: node.hash,
            position: {
                x: node.position.x,
                y: node.position.y,
            },
            type: node.type,
            process: node.core.toJson(),
            inputs: node.inputs.map(toJsonOrNull),
            outputs: node.outputs.map(list => list.map(toJsonOrNull)),
        }
    }

    toJson() {
        return GeonNode.toJson(this);
    }

    log() {
        console.log(`node at ${this.position}`);
        // this.operation.name
        console.log("operation: ");
        this.core.log();
    }

    // ---- Getters

    getHeight() {
        if (this.type == CoreType.Widget) {
            if (this.widget!.size)
                return Math.max(1, this.widget!.size.y);
            else 
                return Math.max(1, this.core.inCount, this.core.outCount);
        } else {
            return Math.max(2, this.core.inCount, this.core.outCount);
        }
    }

    /**
     * This looks werid, but for graph processes, we want the ID of the 'cables' at our output
     * Since the refactor, the cables are identified as the hash of the node, joined by the index of the output
     * NOTE THE CONFUSING BIT: this has nothing to do with the `this.output` socket lists. 
     */
    getSocketKeysAtOutput() : string[] {
        let sockets: string[] = [];
        for (let i = 0; i < this.core.outCount; i++) {
            let socket = Socket.new(this.hash, i+1);
            sockets.push(socket.toString());
        }
        return sockets;
    }

    /**
     * Get a stringified version of all 'cables' the input sockets are pointing to.
     * NOTE THE CONFUSING BIT: these DO involve the this.input values 
     */
    getSocketKeysAtInput() : string[] {
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
        
        if (c + 1 > -this.core.inCount && c < 0) {
            // input
            let input = (c * -1) - 1;
            return Vector2.new(0, input);
        } else if (c > 0 && c-1 < this.core.outCount) {
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
        if (this.core instanceof Widget) {
            let result = this.core.trySelect(local);
            if (result) {
                return result;
            }
        }

        // see if this vector lands on an input socket, an output socket, or the body
        if (local.y < 0 || local.y >= height) {
            // quickly return if we dont even come close
            return undefined;
        } else if (local.x == 0) {
            if (local.y < this.core.inCount) {
                return -(local.y + 1) // selected input
            } else {
                return 0; // selected body
            }
        } else if (local.x > 0 && local.x < NODE_WIDTH-1) {
            return 0; // selected body
        } else if (local.x == NODE_WIDTH-1) {
            if (local.y < this.core.outCount) {
                return local.y + 1 // selected output
            } else {
                return 0; // selected body
            }
        }
        return undefined;
    }

    forEachInputSocket(callback: (local: Socket, connection: Socket | undefined, shim?: TypeShim) => void) {
        for (let i = 0; i < this.core.inCount; i++) {
            callback(Socket.fromNode(this.hash, i, SocketSide.Input), this.inputs[i], this.operation?.ins[i])
        }
    }

    forEachOutputSocket(callback: (local: Socket, connections: Socket[], shim?: TypeShim) => void) {
        for (let i = 0; i < this.core.outCount; i++) {
            callback(Socket.fromNode(this.hash, i, SocketSide.Output), this.outputs[i], this.operation?.outs[i])
        }
    }
}