export function mapToJson<K, V>(map: Map<K, V>, toJson: (obj: V) => any) {
    let json = Object();
    for (let [k, v] of map) {

        // @ts-ignore
        json[k.toString()] = toJson(v);
    }
    return json;
}

export function mapFromJson<T>(json: any, fromJson: (data: any) => T) {
    let map = new Map<string, T>();
    for (let key in json) {
        map.set(key, fromJson(json[key]));
    }
    return map;
}

export function filterMap<K, V>(map: Map<K, V>, predicate: (value: V) => boolean) {
    let filtered = new Map();
    for (let [key, value] of map) {
        if (predicate(value)) {
            filtered.set(key, value);
        }
    }
    return filtered
}