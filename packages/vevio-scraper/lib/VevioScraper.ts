import { VevioSource } from './VevioSource';

import { IScraperOptions, ISourceData, SourceScraper } from 'source-scraper-core';

import axios from 'axios';
import jsonic = require('jsonic');

export interface IVevioScraperQualities {
    [quality: string]: string;
}

export interface IVevioScraperConfig {
    qualities: IVevioScraperQualities;
    poster: string;
    vtt: string;
    spritesheet: string;
    subtitles: any[];
}

export type IVevioScraperOptions = IScraperOptions;

export interface IVevioScraperSourceData extends ISourceData<VevioSource> {
    poster: string;
    title: undefined;
    config: IVevioScraperConfig;
}

export class VevioScraper extends SourceScraper<IVevioScraperSourceData> {
    public name: string = 'vevio';
    public domains: string[] = ['vev.io'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?vev\.io(?:\/embed)?\/([a-zA-Z\d]+)/i;
    public defaultOptions: IVevioScraperOptions = {};

    protected async exec(url: string): Promise<IVevioScraperSourceData> {
        const urlData = this.urlPattern.exec(url);
        if (urlData === null || urlData.length < 2)
            return Promise.reject(new Error('Unexpected url format'));
        const id = urlData[1];
        const apiUrl = `https://vev.io/api/serve/video/${id}`;
        const { data: configJson } = await axios.post(apiUrl);
        const config = jsonic(configJson) as IVevioScraperConfig;
        return {
            config,
            poster: config.poster,
            title: undefined,
            sources: Object.entries(config.qualities).map(([ k, v ]) => new VevioSource({
                url: v,
                resolution: k,
                type: undefined,
                codec: undefined
            }))
        };
    }
}
