// purpose:     the hardcoded default cores 

import { AND, EXPAND, IN, MULTI, NOT, OR, OUT } from "./functions";
import { FN } from "../graph/operation";

export const defaultOperations: FN[] = [
    AND,
    OR,
    NOT,
    MULTI,
    EXPAND,
];
