import normalizeUrl = require('normalize-url');

export interface IHoster {
    name: string;
    quality?: string | number;
    url: string;
}

export class Hoster implements IHoster {
    public name: string;
    public quality?: string | number;
    public url: string;

    constructor({ url, name, quality }: IHoster) {
        this.name = name;
        this.quality = quality;
        this.url = normalizeUrl(url);
    }
}
