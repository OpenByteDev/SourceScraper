import { MasteranimeHoster } from './MasteranimeHoster';

import { HosterRunnerScraper, IHosterData, IRunnerScraperOptions } from 'source-scraper-core';
import { HtmlRunner, IHtmlRunnerArgs, IHtmlRunnerOptions } from 'source-scraper-html-runner';

import jsonic = require('jsonic');

export interface IMasteranimeMirror {
    id: number;
    host_id: number;
    embed_id: string;
    quality: number;
    type: number;
    host: IMasteranimeHost;
}

export interface IMasteranimeHost {
    id: number;
    name: string;
    embed_prefix: string;
    embed_suffix: string | null;
}

export type IMasteranimeScraperOptions = IRunnerScraperOptions<IHtmlRunnerOptions>;

export interface IMasteranimeScraperHosterData extends IHosterData<MasteranimeHoster> {
    mirrors: IMasteranimeMirror[];
}

export class MasteranimeScraper extends HosterRunnerScraper<IHosterData> {
    public name: string = 'masteranime';
    public domains: string[] = ['masterani.me'];
    public urlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?masterani\.me\/anime\/watch\/(\d+-(?:\w+-)+\w+)\/(\d+)/i;
    public defaultOptions: IMasteranimeScraperOptions = {};
    public runner: HtmlRunner<IMasteranimeScraperHosterData> = new HtmlRunner<IMasteranimeScraperHosterData>();

    protected async execWithArgs({ html }: IHtmlRunnerArgs): Promise<IMasteranimeScraperHosterData> {
        const mirrorsRegex = /mirrors='(.+?)'/i;
        const mirrorsData = mirrorsRegex.exec(html);
        if (mirrorsData === null || mirrorsData.length < 2)
            return Promise.reject(new Error('Unable to find mirrors'));
        const argsString = mirrorsData[1];
        const mirrors = jsonic(argsString) as IMasteranimeMirror[];

        const titleRegex = /<img class="cover".*?alt="(.*?)"/i;
        const titleData = titleRegex.exec(html);
        const title = titleData !== null && titleData.length >= 2 ? titleData[1] : undefined;

        return {
            mirrors,
            title,
            hosters: mirrors.map(e => new MasteranimeHoster({
                name: e.host.name,
                quality: e.quality,
                url:
                    (e.host.embed_prefix || '').replace(/\\\//g, '/') +
                    e.embed_id +
                    (e.host.embed_suffix || ''),
                host_id: e.host_id,
                embed_id: e.embed_id,
                host: e.host,
                type: e.type
            }))
        };
    }
}
