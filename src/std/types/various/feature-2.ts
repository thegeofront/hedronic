import { Geometry2 } from "./types-2";

export interface Feature2 {
    trait: "multi-feature-2",
    geometry: Geometry2,
    properties: {},
}

export interface MultiFeature2 {
    trait: "feature-2",   
    features: Feature2,
}

export interface FeatureTable {
    trait: "feature-table-2"
    size: number,
    features: Geometry2[]
}