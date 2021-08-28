export const StandardFunctions = {
    
    TEST,

}

export function TEST(a /* widget: button  x: 3 | y: 3 */,b /* widget: button  x: 5 | y: 5 */
) {
    let [c] = GEON.OR(b, a); /* x: 10 | y: 10 */
    let [d] = GEON.NOT(b); /* x: 10 | y: 10 */
    let [e] = GEON.AND(d, c); /* x: 15 | y: 15 */
    return [e /* widget: output  x: 20 | y: 20 */];
}

export function anonymous(a /* widget: button  x: 5 | y: 5 */,b /* widget: button  x: 5 | y: 5 */
    ) {
    
            let [c] = GEON.NAND(b, a); /* x: 10 | y: 10 */
            let [d] = GEON.OR(b, a); /* x: 10 | y: 10 */
            let [e] = GEON.AND(d, c); /* x: 15 | y: 15 */
            return [e /* widget: output  x: 20 | y: 20 */];
        
    }