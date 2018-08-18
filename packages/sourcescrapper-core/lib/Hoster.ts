import { integer } from './types';

import normalizeUrl = require('normalize-url');

export interface IHoster {
    name: string;
    quality?: string | integer;
    url: string;
}

export class Hoster implements IHoster {
    public name: string;
    public quality?: string | integer;
    public url: string;

    constructor({ url, name, quality }: IHoster) {
        this.name = name;
        this.quality = quality;
        this.url = normalizeUrl(url);
    }
}
