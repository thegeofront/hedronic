import { GeonNode } from "./node";

export type SocketIdx = number; //i < 0 : inputs | i == 0 : node body | i > 0 : outputs

export enum SocketSide { Input, Output, Body };

export class Socket {
    
    private constructor(
        public node: string, 
        public idx: SocketIdx) {}

    static new(node: string, idx: SocketIdx) {
        return new Socket(node, idx);
    }

    static fromNode(node: GeonNode, InputIndex: number, side: SocketSide) {
        // TODO
    }

    static normalIndexToSocketIndex() {

    }

    static socketIndexToNormalIndex() {
        
    }

    getSide() : SocketSide {
        if (this.idx < 0) {
            return SocketSide.Input;
        } else if (this.idx > 0) {
            return SocketSide.Output;
        } else {
            return SocketSide.Body;
        }
    }

    toString() {
        return `node: ${this.node}, idx: ${this.idx}` 
    }
}