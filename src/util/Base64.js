
export class Base64 {

    static getMimeType(urlBase64) {
        return urlBase64.match(/^data:(.+);base64,(.*)$/)[1];
    }

    static toFile(urlBase64) {

        let type = Base64.getMimeType(urlBase64);
        let filename = `file${Date.now()}.${type.split('/')[1]}`;

        return fetch(urlBase64)
                .then(res => { return res.arrayBuffer(); })
                .then(buffer => { return new File([buffer], filename, { type }); })
    }

}