import { Delaunay, Mesh as GeonMesh, MultiVector2, MultiVector3, ObjProcessing } from "../../../../../engine/src/lib";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";
import { divider, shim } from "../../std-system";
import { MultiPoint } from "../v0/multi-point";

/**
 * Simple, triangular mesh
 */
export class Mesh {

    constructor(
        public verts: MultiPoint,
        public faces: number[],
    ) {}

    static readonly TypeShim = TypeShim.new("mesh-3", JsType.Object, undefined, [
        TypeShim.new("vertices", JsType.F32Buffer),
        TypeShim.new("triangles", JsType.U16Buffer),
    ]);

    static new(points: MultiPoint, faces: number[]) {
        return new Mesh(points, faces);
    }

    static newFromFlatArrays(points: number[], faces: number[]) {
        return new Mesh(MultiPoint.fromArray(points), faces);
    }

    static fromDelaunay(points: MultiPoint) {
        // TODO make a full delaunay class, or topomesh, or whatever the ***
        let d = Delaunay.fromPoints(MultiVector3.fromData(points.data).to2D());
        let mesh = d.toMesh();
        return Mesh.newFromFlatArrays(Array.from(mesh.verts.matrix.data), Array.from(mesh.links.data));
    }

    //////

    static toObj(mesh: Mesh) : string {
        // ObjProcessing.write(GeonMesh.from);
        return "TODODOODDO";
    }

    static isoCurves(points: MultiPoint, levels: number[], level: number) {
        // TODO make a full delaunay class, or topomesh, or whatever the ***
        let d = Delaunay.fromPoints(MultiVector3.fromData(points.data).to2D());
        return d.getIsoCurves(levels, level, false);
    }

    static readonly Functions = [
        shim(this.new, "Mesh", "", 
            [JsType.Object, JsType.List], 
            [JsType.Object]),
        shim(this.newFromFlatArrays, "Mesh from arrays", "", 
            [JsType.List, JsType.List], 
            [JsType.Object]),
        shim(this.fromDelaunay, "Delaunay", "", 
            [JsType.List], 
            [JsType.Object]),
        shim(this.isoCurves, "Isocurves", "", 
            [JsType.List, JsType.List, JsType.number], 
            [JsType.Object]),
        divider(),

    ]
}