export type ArrayTree<T> = Array<ArrayTree<T>> | T;

export interface Vector2 {
    type: "vector-2",
    data: Array<number>,
}

export interface Polyline2 {
    type: "polyline-2",
    data: Array<Array<number>>;
}

export interface Polygon2 {
    type: "polygon-2",
    data: Array<Array<number>>;
}

export interface MultiVector2 {
    type: "multi-vector-2",
    data: Array<number>,
}

export interface MultiPolyline2 {
    type: "multi-polyline-2",
    data: ArrayTree<number>;
}

export interface MultiPolygon2 {
    type: "multi-polygon-2",
    data: ArrayTree<number>;
}

export type Geometry2 = 
    Vector2 | 
    Polyline2 |
    Polygon2 | 
    MultiVector2 | 
    MultiPolyline2 | 
    MultiPolygon2;

