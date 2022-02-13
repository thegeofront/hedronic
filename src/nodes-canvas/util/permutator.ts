// purpose: simple code that spits out unique names
// note:    the stripped sequences are not perfect, please forgive me :)

export enum Casing {
    lower,
    upper
}

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class Permutator {

    constructor(
        private readonly sequence: string, 
        private readonly maxSize = 6,
        private counter = 0,
        private stripping = true,
        private readonly len = sequence.length) {}

    static new() {

    }

    static newAlphabetPermutator(casing = Casing.lower, maxSize=6) {
        let alphabet = casing == Casing.lower ? LOWER : UPPER;
        return new Permutator(alphabet, maxSize);
    }    

    next() {
        let name = this.generate(this.counter);
        this.counter += 1;
        return name;
    }

    generate(n: number) {

        let str = "";
        let size = this.stripping ? this.degree(n) : this.maxSize;
        
        for (let i = size -1; i > -1; i -= 1) {
            let den = Math.pow(this.len, i)
            let count = Math.floor(n / den);
            str += this.sequence[count % this.len];
        }
        return str;
    }

    degree(n: number) {
        for (let i = 1; i < this.maxSize; i++) {
            if (n < Math.pow(this.len, i)) {
                return i;
            }
        }
        return 3;
    }
}

