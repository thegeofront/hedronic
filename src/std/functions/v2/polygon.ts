import { Polygon2 } from "../../../../../engine/src/lib";
import { FunctionShim } from "../../../modules/shims/function-shim";
import { TypeShim } from "../../../modules/shims/type-shim";
import { JsType } from "../../../modules/types/type";

// export interface Polygon2 {
//     trait: "polygon-2",
//     data: Array<Array<number>>;
// }

const GeoJsonGeometryType = TypeShim.new("geojson-geometry", JsType.Object, undefined, [

]);
const PolygonType = TypeShim.new("polygon-2", JsType.Object, undefined, []);
const MeshType = TypeShim.new("mesh-2", JsType.Object);
const PointType = TypeShim.new("vector-2", JsType.Object);

export function getPolygonFunctions(namespace="functions") {
    
    const name = "polygon";

    return [
        FunctionShim.new("fromGeoJson", [namespace], polygonsFromGeojson, [GeoJsonGeometryType], [PolygonType]),
        FunctionShim.new("toMesh", [namespace], polygonToMesh, [PolygonType], [MeshType]),
        FunctionShim.new("scale", [namespace], scale, [PolygonType, TypeShim.new("factor", JsType.number)], [PolygonType]),
        FunctionShim.new("getCenter", [namespace], getCenter, [PolygonType], [PointType])
    ]
}

/**
 * Create a polygon from geojson info
 */
function polygonsFromGeojson(geojson: any) : Polygon2[] {
    if (geojson.type === "Polygon") {
        return [Polygon2.fromList(geojson.coordinates)];
    } 

    if (geojson.type === "MultiPolygon") {
        return geojson.coordinates.map((coordSet: number[][][]) => Polygon2.fromList(coordSet));
    }

    return [];
}

function polygonToMesh(polygon: Polygon2) {
    return polygon.toMesh();
}

function scale(polygon: Polygon2, factor: number) {
    let p = polygon.clone();
    p.scale(-factor);
    return p;
}

function getCenter(polygon: Polygon2) {
    return polygon.getCenter();
}