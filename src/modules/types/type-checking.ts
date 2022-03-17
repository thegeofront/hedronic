import { TypeShim } from "../shims/type-shim";
import { Type } from "./type";

export namespace TypeChecking {
    
    export function doTypesFit(self: TypeShim, other: TypeShim) {
        // console.log("this", this.typeToString(), "other", other.typeToString())

        // Any is difficult, it could potentially lead to unsafe circumstances. 
        // however, if the 'other' is any, we can accept everything 
        if (other.type == Type.any) return true;

        if (other.type == Type.Reference) {
            return self.isAcceptableType(other.children![0]);
        }
        if (self.type == Type.Reference) {
            return self.children![0].isAcceptableType(other);
        }

        if (self.type == Type.Literal) {
            return self.children![0].name == other.children![0].name;
        }

        // deal with union types
        if (other.type == Type.Union) {
            if (!other.children) throw new Error("should have children!");
            let others = other.children!;
            for (let oChild of others) {
                if (self.isAcceptableType(oChild)) {
                    return true;
                }
            }
            return false;
        }
        if (self.type == Type.Union) {
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
        if (other.type == Type.Tuple || other.type == Type.List || other.type == Type.Object) {   
            let selfs = self.children!;
            let others = other.children!;
            if (!selfs || !others) return false;
            // if (others.length == 0) return true;
            if (!hasCorrespondence(selfs, others)) return false;
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