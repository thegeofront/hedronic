/**
 * Type class pattern
 * 
 * Rules :
 * 1. These evens will only be consumed / listened to in one file, at one place. 
 * 2. In these files, define a PayloadEventType at the top of the page
 */
export class PayloadEventType<T> {

    constructor(
        public name: string,
        public type?: T,
    ) {}
}