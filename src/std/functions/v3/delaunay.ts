import { Delaunay as DT, Mesh as GeonMesh, MultiVector2, MultiVector3, ObjProcessing } from "../../../../../engine/src/lib";
import { TypeShim } from "../../../modules/shims/type-shim";
import { Type } from "../../../modules/types/type";
import { divider, shim } from "../../std-system";
import { MultiPoint } from "../v0/multi-point";

/**
 * Simple, triangular mesh
 */
// export class Delaunay {

//     constructor(
//         private dt: DT,
//     ) {}

//     static new(points: MultiPoint) {
//         return new Delaunay(DT.fromPoints(MultiVector3.fromData(points.data).to2D()));
//     }

//     static newFromFlatArrays(points: number[], faces: number[]) {
//         return new Delaunay(MultiPoint.fromArray(points), faces);
//     }

//     static fromDelaunay(points: MultiPoint) {
//         // TODO make a full delaunay class, or topomesh, or whatever the ***
//         let d = Delaunay.fromPoints(MultiVector3.fromData(points.data).to2D());
//         let mesh = d.toMesh();
//         return Mesh.newFromFlatArrays(Array.from(mesh.verts.matrix.data), Array.from(mesh.links.data));
//     }

//     //////

//     static toObj(delaunay: Delaunay) : string {
//         // ObjProcessing.write(GeonMesh.from);
//         return "TODODOODDO";
//     }

//     static readonly Functions = [
//         shim(this.new, "Mesh", "", 
//             [Type.Object, Type.List], 
//             [Type.Object]),
//         shim(this.newFromFlatArrays, "Mesh from arrays", "", 
//             [Type.List, Type.List], 
//             [Type.Object]),
//         shim(this.fromDelaunay, "Delaunay", "", 
//             [Type.List], 
//             [Type.Object]),
//         divider(),

//     ]
// }