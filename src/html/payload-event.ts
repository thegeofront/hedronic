/**
 * Type class pattern
 */
export class PayloadEventType<T> {

    constructor(
        public name: string,
        public type?: T,
    ) {}
}