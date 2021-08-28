// purpose:     the hardcoded default cores 

import { AND, NOT, OR, NAND} from "./functions";
import { TEST } from "./standard-functions";
import { FN } from "../graph/operation";

export const defaultOperations: FN[] = [
    AND,
    OR,
    NOT,
    NAND,
    TEST,
];
