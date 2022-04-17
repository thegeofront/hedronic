
export function decode(text: string): Object {
    return JSON.parse(text)
}

export function encode(json: any, indent?: number): string {
    return JSON.stringify(json, undefined, indent);
}