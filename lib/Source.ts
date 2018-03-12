import normalizeUrl = require('normalize-url');

export class Source {
    public url: string;
    public type?: string;
    public codec?: string;
    public resolution?: string;

    constructor({ url, type, codec, resolution }: { url: string, type?: string, codec?: string, resolution?: string }) {
        this.type = type;
        this.codec = codec;
        this.resolution = resolution;
        this.url = normalizeUrl(url);
    }
}
