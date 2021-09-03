let BOOL = import("bool.js");
let MATH = import("math.js");

function anonymous(a /* "widget": "button" | "state": "false" | "x": 4 | "y": 3 */,b /* "widget": "button" | "state": "true" | "x": 4 | "y": 0 */
) {
    let [c] = GEON.OR(b, a) /* "x": 8 | "y": 2 */;
    let [d] = GEON.NOT(b) /* "x": 8 | "y": 0 */;
    let [e] = GEON.AND(d, c) /* "x": 11 | "y": 1 */;
    return [e /* "widget": "lamp" | "x": 14 | "y": 1 */];
}