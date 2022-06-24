export namespace RustConversion {

    export function isRenderable(data: any) {
        try {
            return data.constructor.gf_has_trait_renderable();
        } catch {
            return false;
        }
    }

    export function isGeoData(data: any) {
        try {
            return data.constructor.gf_has_trait_geodata();
        } catch {
            return false;
        }
    }

    export function isDescriptor(data: any) {
        try {
            return data.constructor.gf_has_trait_descriptor();
        } catch {
            return false;
        }
    }

    

}