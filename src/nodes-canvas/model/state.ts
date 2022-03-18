/**
 * State represents ANY value which traverses the flowchart
 */
export type State = 
    undefined | 
    boolean | 
    string | 
    number | 
    Object | 
    Array<State> | 
    ArrayBuffer;

