import { IScrapper } from './Scrapper';

import normalizeUrl = require('normalize-url');
import trim = require('trim-character');

export interface ISource {
    url: string;
    type?: string;
    codec?: string;
    resolution?: string;
}

export class Source implements ISource {
    public url: string;
    public type?: string;
    public codec?: string;
    public resolution?: string;

    constructor({ url, type, codec, resolution }: ISource) {
        this.type = type;
        this.codec = codec;
        this.resolution = resolution;
        this.url = normalizeUrl(url);
    }
    public getNormalizedResolution(): number | undefined {
        if (typeof this.resolution === 'undefined')
            return;
        const i = this.resolution.indexOf('x');
        return Number(i !== -1 ?
            trim.right(this.resolution.substring(i), 'p') :
            this.resolution);
    }
}

export interface ISourceData<T extends ISource = Source> {
    poster?: string;
    title?: string;
    sources: T[];
}

export interface ISourceScrapper<T extends ISourceData = ISourceData> extends IScrapper<T> {
}
