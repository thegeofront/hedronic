export class IO {

    static async importLibrary(path: string) {
    
        // let lib2 = await require(/* webpackIgnore: true */ location + path);
        // console.log(lib2);

        // NOTE: I'm forced to do this really convoluted, hacky stuff, 
        // because the above wont work for some reason 
        // const response = await fetch(location + path);
        // const text = await response.text();   
        return await IO.loadLibrary(await IO.fetchText(path));
    }

    static async loadLibrary(libaryContent: string) {
        const dataUri = 'data:text/javascript;charset=utf-8,'+ libaryContent;
        
        //@ts-ignore
        let res = await import(/* webpackIgnore: true */ dataUri);
        return res;
    }

    static async fetchText(path: string) {
        const response = await fetch(location + path);
        return await response.text();  
    }

    static promptDownload(file: string, text: string) {
        var element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8, " + encodeURIComponent(text));
        element.setAttribute("download", file);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}