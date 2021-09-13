export function mapToJson<K, V>(map: Map<K, V>, toJson: (obj: V) => any) {
    let json = Object();
    for (let [k, v] of map) {
        json[k] = toJson(v);
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