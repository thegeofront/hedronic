export namespace JSLoading {

    export async function load(code: string) {
        const dataUri = 'data:text/javascript;charset=utf-8,'+ code;
        
        //@ts-ignore
        let res = await import(/* webpackIgnore: true */ dataUri);
        return res;
    }
}