// purpose:     the hardcoded default cores 

import { AND, EXPAND, IN, MULTI, NOT, OR, OUT } from "./functions";
import { FN } from "./operation-core";

export const defaultGizmos: FN[] = [
    IN,
    OUT,
]

export const defaultOperations: FN[] = [
    IN,
    OUT,
    AND,
    OR,
    NOT,
    MULTI,
    EXPAND,
];
