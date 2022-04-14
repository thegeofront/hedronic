export type ArrayTree<T> = Array<ArrayTree<T>> | T;

export interface Vector2 {
    trait: "vector-2",
    data: Array<number>,
}

export interface Polyline2 {
    trait: "polyline-2",
    data: Array<Array<number>>;
}

// export interface Polygon2 {
//     trait: "polygon-2",
//     data: Array<Array<number>>;
// }

export interface MultiVector2 {
    trait: "multi-vector-2",
    data: Array<number>,
}

export interface MultiPolyline2 {
    trait: "multi-polyline-2",
    data: ArrayTree<number>;
}

export interface MultiPolygon2 {
    trait: "multi-polygon-2",
    data: ArrayTree<number>;
}

export type Geometry2 = 
    Vector2 | 
    Polyline2 |
    MultiVector2 | 
    MultiPolyline2 | 
    MultiPolygon2;

