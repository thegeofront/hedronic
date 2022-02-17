import { DTSLoader } from "./dts-loader";

export class Librarian {

    constructor() {}

    parse() {
        let file = "wasm-modules/cityjson_validator.d.ts";
        DTSLoader.load(file, {});       
    }
}