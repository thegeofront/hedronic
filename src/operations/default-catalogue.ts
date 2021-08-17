// purpose:     the hardcoded default cores 

import { AND, EXPAND, MULTI, NOT, OR } from "./functions";
import { FN } from "../graph/operation";

export const defaultOperations: FN[] = [
    AND,
    OR,
    NOT,
    MULTI,
    EXPAND,
];
