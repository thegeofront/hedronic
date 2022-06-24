import { State } from "../../nodes-canvas/model/state";
import { TypeShim } from "../shims/type-shim";
import { JsType } from "./type";

export namespace TypeChecking {
    
    export function convert(visitorState: State, visitor: TypeShim, host: TypeShim) {
        let isSelfList = visitor.type == JsType.List;
        let isOtherList = host.type == JsType.List;

        if (!isSelfList && !isOtherList) {
            return visitorState;
        } 
        if (!isSelfList && isOtherList) {

        }
    }

    export function doTypesFitDisregardingLists(visitor: TypeShim, host: TypeShim) : boolean {
        let isVisitorList = visitor.type == JsType.List;
        let isHostList = host.type == JsType.List;
        let backup = TypeShim.new("", JsType.Object);

        if (!isVisitorList && !isHostList) 
            return doTypesFit(visitor, host); // both are not list, compare as normal
        
    
        if (!isVisitorList && isHostList) 
            return doTypesFitDisregardingLists(visitor, host.children?.[0] || backup); // only host is list, see if it fits 
        
        if (isVisitorList && !isHostList) 
            return doTypesFitDisregardingLists(visitor.children?.[0] || backup, host);
        
        if (isVisitorList && isHostList) 
            return doTypesFitDisregardingLists(visitor.children?.[0] || backup, host.children?.[0] || backup); // both are lists, check if their items match up
        
        return false; // never happens
    }


    export function doTypesFit(self: TypeShim, other: TypeShim) {
        // console.log("this", this.typeToString(), "other", other.typeToString())

        // Any is difficult, it could potentially lead to unsafe circumstances. 
        // however, if the 'other' is any, we can accept everything 
        if (other.type == JsType.any) return true;

        if (other.type == JsType.Reference) {
            return self.isAcceptableType(other.children![0]);
        }
        if (self.type == JsType.Reference) {
            return self.children![0].isAcceptableType(other);
        }

        // the literal can be used as a type flag
        if (self.type == JsType.Literal) {
            return self.children![0].name == other.children![0].name;
        }

        // deal with union types
        if (other.type == JsType.Union) {
            if (!other.children) throw new Error("should have children!");
            let others = other.children!;
            for (let oChild of others) {
                if (self.isAcceptableType(oChild)) {
                    return true;
                }
            }
            return false;
        }

        if (self.type == JsType.Union) {
            if (!self.children) throw new Error("should have children!");
            let children = self.children!;
            for (let child of children) {
                if (child.isAcceptableType(other)) {
                    return true;
                }
            }
            return false;
        }

        // after that, do not accept different base types anymore
        if (other.type != self.type) return false;

        // types with nested types will require additional checks
        // we only care if the actual types match. 
        // They do not have to have the same name 
        // we stick to the JS notion of : 'if it acts like X, it is X'
        if (other.type == JsType.Tuple || other.type == JsType.List || other.type == JsType.Object) {   
            let selfs = self.children;
            let others = other.children;
            let selfNoChildren = (!selfs || selfs.length == 0) 
            let otherNoChildren = (!others || others.length == 0) 
            if (selfNoChildren && otherNoChildren) return true; // we accept 'anonymous objects'
            if (selfNoChildren || otherNoChildren) return false; // we dont accept 1 of the two as anonymous
            // if (others.length == 0) return true;
            if (!hasCorrespondence(selfs!, others!)) return false;
        }

        return true;
    }
    
    /**
     * We want to know if all things 'other' asks for are present in 'self' 
     */
    function hasCorrespondence(selfs: TypeShim[], others: TypeShim[]) {
        
        let selfKeys = selfs.map(t => t.name);
        let otherKeys = others.map(t => t.name);

        for (let i = 0 ; i < otherKeys.length; i++) {
            let otherKey = otherKeys[i];

            // key must be present, and the type must fit
            let j = selfKeys.indexOf(otherKey);
            if (j == -1) {
                return false;
            } 
            if (!doTypesFit(selfs[j], others[i])) {
                return false;
            }
        }

        return true;
    }
}


// function doSomething(left: any, right: any) {
//     return [getLengths(left), getLengths(right)];
// }

// function makeArray(data: any) {
//     if (something instanceof Array) {
//         return data;
//     } else {
//         return [data]
//     }
// }

// function getLengths(something: any) : number {
//     if (something instanceof Array) {
//         return length;
//     }
//     return 1;
// }

// function test() {

//     let res = doSomething([1], [1,2,3,4]);
//     res = doSomething(1, [1,2,3]);
//     console.log(res);
//     res = doSomething(undefined, [1,2,3]);
//     console.log(res);
//     res = doSomething([], [1,2,3]);
//     console.log(res);
//     res = doSomething([1,2,3], 1);
//     console.log(res);
//     res = doSomething([1,2,3], [1,2,3]);
//     console.log(res);
//     res = doSomething([1,2,3], [[], [1,2,3],[1,2,3], []]);
//     console.log(res);

// }

// test();