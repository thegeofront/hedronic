/**
 * State represents ANY value which traverses the flowchart
 */
export type State = 
    void | 
    boolean | 
    string | 
    number | 
    Object | 
    Array<State> | 
    ArrayBuffer;

