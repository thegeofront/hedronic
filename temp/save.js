function something(a /* "widget": "button" | "x": 3 | "y": 4 */,c /* "widget": "button" | "x": 5 | "y": 0 */,i /* "widget": "button" | "x": 3 | "y": 12 */) {
    let [b] = GEON.XOR(a)     /* "x": 10 | "y": 8 */;
    let [d] = GEON.TEST(c, a) /* "x": 10 | "y": 5 */;
    let [e] = GEON.OR(c, a)   /* "x": 10 | "y": 2 */;
    let [f] = GEON.NOT(c) /* "x": 10 | "y": 0 */;
    let [g] = GEON.AND(f, e) /* "x": 15 | "y": -4 */;
    let [h] = GEON.TEST(d, g) /* "x": 19 | "y": 6 */;
    let [j] = GEON.GRAPH(i) /* "x": 12 | "y": 13 */;
    let [] = GEON.GRAPH(j) /* "x": 18 | "y": 9 */;
    return [b /* "widget": "output" | "x": 20 | "y": 0 */, h /* "widget": "display" | "x": 21 | "y": 4 */];
}