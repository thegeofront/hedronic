import { URL } from "../../util/url";

const CDN = "https://cdn.jsdelivr.net/npm";

export enum ModuleSource {
    Unknown,
    JavaScript,
    Wasm,
}

export class ModuleMetaData {

    constructor(
        public source: ModuleSource,
        public filename: string, 
        public fullname: string, 
        public version: string, 
        public address: string, 
        public icon: string, 
        public jsPath: string, 
        public dtsPath: string, 
        public wasmPath: string, 
    ) {}

    // a couple of config options are possible. dissect all of them
    static fromDepJsonItem(nickname: string, data: any) {
        
        let filename = "";
        let fullname = "";
        let version = "";
        let address = "";
        let icon = "";
        
        // try to fill the above things with
        if (data instanceof Object) {
            if (data.address) { 
                address = data.address 
                if (!address.endsWith('/')) {
                    address = address + "/"; 
                } 
            }
            if (data.fullname) { fullname = data.fullname; }
        }

        if (typeof data === "string") {
            version = data;
        } 

        // defaults
        if (address == "") {
            if (version == "") {
                address = `${CDN}/${nickname}/`;
            } else {
                address = `${CDN}/${nickname}@${version}/`;
            }
        }
        
        if (filename == "") {
            filename = nickname.slice()
            filename = filename.replace('-','_');
            console.log(filename);
        }
        
        if (fullname == "") {
            fullname = nickname;
        }

        // const nickname = config.nickname;
        let base = "";

        // // this is a dumb, error-prone hack
        // // I think i'm doing this to load a locally saved module.
        if (!address.includes("http")) {
            base = URL.getBase();
        }

        const jsPath = base + address + filename + ".js";
        const dtsPath = base + address + filename + ".d.ts";
        const wasmPath = base + address + filename + "_bg.wasm";
        
        return new ModuleMetaData(ModuleSource.Unknown, filename, fullname, version, address, icon, jsPath, dtsPath, wasmPath);
    }
}
