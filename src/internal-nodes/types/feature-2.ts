import { Geometry2 } from "./types-2";

export interface Feature2 {
    type: "multi-feature-2",
    geometry: Geometry2,
    properties: {},
}

export interface MultiFeature2 {
    type: "feature-2",   
    features: Feature2,
}

export interface FeatureTable {
    type: "feature-table-2"
    size: number,
    features: Geometry2[]
}