import { IScrapper } from './Scrapper';
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

export interface IHosterData<T extends IHoster = Hoster> {
    title?: string;
    hosters: T[];
}

export interface IHosterScrapper<T extends IHosterData = IHosterData> extends IScrapper<T> {
}
