
// enum JsType { 
//     void,
//     any,
//     boolean,
//     number,
//     string,
//     List,
//     Tuple,
//     Object,
//     Union,
//     Reference, // this is how foreign types / objects are represented
//     Promise,
//     Literal,
//     Blob,      // Vec<?>   // Unknown
//     U8Buffer,  // Vec<u8>  // Byte
//     I8Buffer,  // Vec<u8>  // (leave out)
//     U16Buffer, // Vec<u8>  // (leave out)
//     I16Buffer, // Vec<u8>  // (leave out)
//     U32Buffer, // Vec<u32> // Unt
//     I32Buffer, // Vec<i32> // int
//     F32Buffer, // Vec<f32> // Float
//     F64Buffer, // Vec<f64> // Double
// }

// enum GFTypes {
//     Range1,
//     Range2,
//     Range3,
//     Point,
//     Vector,
//     Line,
//     Mesh,
//     MultiLine,
//     MultiPoint, 
//     MultiVector,
// }

// class TypeShim {

//     traits: GFTypes[] = [];

//     constructor(
//         public name:  string, // human-readable name
//         public type: JsType, // the actual type  
//         public readonly glyph?: string,  // how to visualize the type or variable in shortened form
//         public readonly children?: TypeShim[], // sub-types to handle generics. a list will have an 'item' sub-variable for example
//     ) {}

//     // ...
// }

// class FunctionShim {

//     constructor(
//         public readonly name: string,      // human-readable name
//         public path: string[] | undefined, // this explains where the function can be found in the Geofront menu tree. 
//         public readonly func: Function,    // the raw function this shim represents
//         public readonly ins: TypeShim[], // input types 
//         public readonly outs: TypeShim[], // output types 
//         public readonly isMethod = false, // signal that this function is a method of the object type found at the first input type  
//     ) {}

//     // ... 
// }











// // things to make pseudo kahn happy 
// class SomeNode {

//     id: NodeID = 0;

//     count_number_of_filled_inputs() {
//         return 0;    
//     }

//     for_all_node_at_my_outputs(a: (node: SomeNode) => void ) {

//     }

// }

// type NodeID = number;
// type int = number;

// function dequeue(q: any) {
//     return new SomeNode();
// }

// function get_id_of_output_node(node: SomeNode) {
//     return 0;
// }

// function pseudo_kahn(nodes: Array<SomeNode>) {

//     let order: Array<NodeID> = [];   //  Make an `order` list
//     let visited: int = 0;           // Make a `visisted` counter, initialized at 0
//     let dependency: Map<NodeID, int> = new Map();  // Make a `dependency` counter for each node, initialized at 0

//     // Add 1 to this counter for each input edge of this node.
//     for (let node of nodes) {
//         dependency.set(node.id, node.count_number_of_filled_inputs());
//     }

//     // Fill a queue with all dependency 0 nodes. These are the starters.
//     let queue = []
//     for (let node of nodes) {
//         if (dependency.get(node.id) == 0) {
//             queue.push(node)
//         }
//     }

//     // Repeat until the queue is empty.
//     while (queue.length > 0) {
//         // Remove a node from the queue (Dequeue operation)
//         // add the nodes' id to the `order` list.
//         // Increment `visisted` counter by 1.
//         visited += 1;
//         let node = dequeue(queue);
//         order.push(node.id);

//         node.for_all_node_at_my_outputs((output_node) => {
//             let count = dependency.get(output_node.id)!;
//             count -= 1; 
//             dependency.set(output_node.id, count);
//             if (count == 0) {
//                 queue.push(node);
//             }
//         })
//     }

//     // If `visisted` counter is not equal to the number of nodes, 
//     // then the graph was degenerate, probably cyclical. 
//     if (visited != nodes.length) {
//         console.error("graph is degenerate!")
//         return [];
//     }

//     return order;
// }






