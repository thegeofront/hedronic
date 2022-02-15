import { GeonNode } from "./node";

//si < 0 : inputs | si == 0 : node body | si > 0 : outputs
export type SocketIdx = number; 

export const enum SocketSide { Input=-1, Body=0, Output=1, Widget=1000};

export class Socket {
    
    private constructor(
        public node: string, 
        public idx: SocketIdx) {}
 
    get side() {
        return Socket.getSide(this.idx);
    }

    static new(node: string, idx: SocketIdx) {
        return new Socket(node, idx);
    }

    static null() {
        return new Socket("", 0);
    }

    isNull() {
        return this.node === "" && this.idx == 0;
    }

    cloneFrom(other: Socket) {
        this.node = other.node;
        this.idx = other.idx;
    }

    static fromNode(node: string, normalIndex: number, side: SocketSide) {
        return Socket.new(node, this.normalIndexToSocketIndex(normalIndex, side));
    }

    static toJson(s: Socket) {
        return {node: s.node, index: s.idx} 
    }

    static fromJson(data: any) {
        return Socket.new(data.node, data.index); 
    }

    static normalIndexToSocketIndex(normalIndex: number, side: SocketSide) {
        if (side == SocketSide.Input) {
            return (normalIndex + 1) * -1;
        } else if (side == SocketSide.Output) {
            return normalIndex + 1;
        } else {
            return 0;
        }
    }

    static socketIndexToNormalIndex(idx: SocketIdx) {
        let side = this.getSide(idx);
        
        if (side == SocketSide.Input) {
            return (idx * -1) - 1;
        } else if (side == SocketSide.Output) {
            return idx - 1;
        } else {
            return 0;
        }
    }

    static getSide(idx: number) : SocketSide {
        if (idx == 1000 || idx == Infinity) {
            return SocketSide.Widget
        } else if (idx < 0) {
            return SocketSide.Input;
        } else if (idx > 0) {
            return SocketSide.Output;
        } else {
            return SocketSide.Body;
        }
    }

    toJson() {
        return Socket.toJson(this);
    }

    normalIndex() {
        return Socket.socketIndexToNormalIndex(this.idx);
    }

    toPrintString() {
        return `idx: ${this.idx} | node: ${this.node}`; 
    }

    toString() {
        return `${this.node}${this.idx}`;
    }

}