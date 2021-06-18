import { Vector2 } from "../../../engine/src/lib";
import { Operation } from "../operations/operation";
import { ConnectorIdx } from "./graph";


export class GeonNode {

    private constructor(
        public position: Vector2, 
        public operation: Operation,
        public connections: Map<ConnectorIdx, string>) {}

    static new(gridpos: Vector2, op: Operation) {
        let connections = new Map();
        return new GeonNode(gridpos, op, connections);
    }

    run(...args: boolean[]) {
        return this.operation.run(...args);
    }

    log() {
        console.log(`chip at ${this.position}`);
        // this.operation.name
        console.log("operation: ")
        this.operation.log();
    }

    // ---- Selection

    getConnectorGridPosition(c: ConnectorIdx) {
        let gp = this.GetComponentLocalGridPosition(c); 
        if (gp === undefined) {
            return undefined;
        }
        return this.position.added(gp);
    }

    GetComponentLocalGridPosition(c: ConnectorIdx) {
        
        if (c + 1 > -this.operation.inputs && c < 0) {
            // input
            let input = (c * -1) - 1;
            return Vector2.new(0, input);
        } else if (c > 0 && c-1 < this.operation.outputs) {
            // output 
            let output = c - 1;
            return Vector2.new(2, output);
        } else {
            return undefined;
        }
    }

    trySelect(gp: Vector2) : number | undefined {
        let max = Math.max(this.operation.inputs, this.operation.outputs);

        // see if this vector lands on an input socket, an output socket, or the body
        let local = gp.subbed(this.position);
        if (local.y < 0 || local.y >= max) {
            return undefined;
        } else if (local.x == 0) {
            if (local.y < this.operation.inputs) {
                return -(local.y + 1) // selected input
            } else {
                return 0; // selected body
            }
        } else if (local.x == 1) {
            return 0; // selected body
        } else if (local.x == 2) {
            if (local.y < this.operation.outputs) {
                return local.y + 1 // selected input
            } else {
                return 0; // selected body
            }
        }
        return undefined;
        
    }

    // ---- Connection

    addConnection() {

    }

    hasConnection() {
        
    }

    removeConnection() {

    }

    // ---- Create Special properties

    attach() {
        // input something like: 
        // html.onclick() => node.run()
        
        // output something like:
        // node.afterRun() => html.switch colors 
    }
}
