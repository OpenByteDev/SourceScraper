import normalizeUrl = require('normalize-url');

export class Hoster {
    public name: string;
    public url: string;
    public quality?: string | number;
    public data?: string;

    constructor({ url, name, quality, data }: { url: string, name: string, quality?: string | number, data?: any }) {
        this.url = normalizeUrl(url);
        this.name = name;
        this.quality = quality;
        this.data = data;
    }
}
