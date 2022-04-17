export function asNumber(n: any) : number {
    return Number(n);
}

export function asBoolean(n: any) : boolean {
    return Boolean(n);
}

export function asString(n: any): string {
    return String(n);
}

export function asList(any: any): any[] {
    return any as Array<any>;
}

