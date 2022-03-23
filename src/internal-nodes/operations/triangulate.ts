import { Triangulator } from "../../../../engine/src/lib";
import { FunctionShim } from "../../modules/shims/function-shim";
import { TypeShim } from "../../modules/shims/type-shim";
import { Type } from "../../modules/types/type";

const PolygonType = TypeShim.new("polygon", Type.List, undefined, [TypeShim.new("", Type.List, undefined, [TypeShim.new("", Type.number)])]);
const MeshType = TypeShim.new("mesh", Type.Object);

export function getTriangulateFunctions(namespace="functions") {

    return [
        new FunctionShim("triangulatePolygon", [namespace], multiPolygonToMesh, [PolygonType], [MeshType])
    ]; 
}

function multiPolygonToMesh(arrayTree: any) {
    let res = Triangulator.flatten(arrayTree);
    let vertices = res.vertices;

    let triangles = Triangulator.triangulate(
        res.vertices, 
        res.holes, 
        res.dimensions);

    return {
        type: `mesh-${res.dimensions}`,
        vertices,
        triangles,
    }
}