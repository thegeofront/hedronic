// https://www.sheshbabu.com/posts/rust-for-javascript-developers-pattern-matching-and-enums/
// *sigh*, if only we could write something like this. 
// ```
// enum TypeKind {
//     Any,
//     Boolean,
//     Number,
//     String,
//     List(TypeKind),
//     Tuple(TypeKind[]),
// }
// ``` 
// thats really all we need. Now, we need to do weird things

export enum Type {
    
    // basics
    void,
    any,
    boolean,
    number,
    string,

    // constructs 
    Array,
    List,
    Tuple,
    Object,

    // weirds
    Union,
    Reference,
    Promise,
}