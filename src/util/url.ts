export namespace URL {

    /**
     * Get the base url of our current window.location
     */
    export function getBase() {
        let loc = window.location
        return `${loc.protocol}//${loc.host}${loc.pathname}`;
    }

    /**
     * Generate a new url based on the current base url, but with different paramters
     */
    export function fromBaseAndParams(parameters?: Map<string, string | number | boolean>) {
        let base = URL.getBase();
        let parts = [];
        if (!parameters) return base;
        for (let [key, value] of parameters.entries()) {
            let encoded = encodeURIComponent(value);
            parts.push(`${key}=${encoded}`);
        }
        if (parts.length == 0) return base;

        return `${base}?${parts.join('&')}`;
    }

    export function getParams(keys: string[]) : (string | null)[] {
        const string = window.location.search;
        let url = new URLSearchParams(string); 
        return keys.map(key => url.get(key));
    }
}