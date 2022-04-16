/**
 * Pseudo random number generator. based on simple fast counter (sfc32)
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 */
 export class Random {
    private constructor(
        private a: number,
        private b: number,
        private c: number,
        private d: number,
    ) {}

    // private static new(a: number, b: number, c: number, d: number) {
    //     return new Random(a, b, c, d);
    // }

    static new() {
        return this.newFromSeed(Math.random() * 103948857);
    }

    static newFromSeed(n: number) {
        var seed = n ^ 0xdeadbeef; // 32-bit seed with optional XOR value
        // Pad seed with Phi, Pi and E.
        // https://en.wikipedia.org/wiki/Nothing-up-my-sleeve_number
        var rand = new Random(0x9e3779b9, 0x243f6a88, 0xb7e15162, seed);
        for (var i = 0; i < 15; i++) rand.number();
        return rand;
    }

    static newFromHash(seed: string) {
        var seeder = xmur3(seed);
        return new Random(seeder(), seeder(), seeder(), seeder());
    }

    /**
     * number in between 0 and 1
     */
    number(): number {
        // sfc32
        this.a >>>= 0;
        this.b >>>= 0;
        this.c >>>= 0;
        this.d >>>= 0;
        let t = (this.a + this.b) | 0;
        this.a = this.b ^ (this.b >>> 9);
        this.b = (this.c + (this.c << 3)) | 0;
        this.c = (this.c << 21) | (this.c >>> 11);
        this.d = (this.d + 1) | 0;
        t = (t + this.d) | 0;
        this.c = (this.c + t) | 0;
        return (t >>> 0) / 4294967296;
    }

    array(length: number) {
        let array = new Float64Array(length);
        for (let i = 0 ; i < array.length; i++) {
            array[i] = this.number();
        }
        return array;
    }

    // /**
    //  * get random integer
    //  */
    // int(max: number) {
    //     return Math.floor(this.number() * max);
    // }

    /**
     * get random item from array
     */
    // private choose<T>(array: ArrayLike<T>) {
    //     let choice = this.int(array.length);
    //     return array[choice];
    // }

    // private chooseWeighted<T>(array: ArrayLike<T>, weights: ArrayLike<number>) {
    //     let choice = this.weightedIndex(weights);
    //     return array[choice];
    // }

    /**
     * 2n implementation of ChooseWeighted
     */
    //  private weightedIndex(weights: ArrayLike<number>) {
        
    //     let sumOfWeights = 0;
    //     for (let i = 0; i < weights.length; i++) {
    //         sumOfWeights += weights[i];
    //     }

    //     let value = this.number() * sumOfWeights;
    //     for (let i = 0; i < weights.length; i++) {
    //         value -= weights[i];
    //         if (value < 0) {
    //             return i;
    //         }
    //     }

    //     // will never get here, since this.get() includes 0, and excludes 1. 
    //     // it will always be smaller than the sum of weights
    //     console.error("RANDOM: should never happen...")
    //     return 0;
    // }
}

function xmur3(str: string) {
    for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19));
    return function () {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}
