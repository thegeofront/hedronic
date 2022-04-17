export async function fetchJson(path: string) {
    let data = await fetch(path);
    return await data.json();
}

export async function fetchText(path: string) {
    let data = await fetch(path);
    return await data.text();
}
