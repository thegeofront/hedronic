/**
 * Inspired by rust's way of doing things 
 * 
 * All `Type.Object parameters can recieve one or more of these Traits
 * This means that the object *as* this trait, or can be used *as if* it were like this trait. 
 * 
 */

export enum Trait {
    Vector3, 
    MultiVector3,
    Line3,
    MultiLine3,
    Mesh,
}