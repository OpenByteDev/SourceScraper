import { MasteranimeHoster } from './MasteranimeHoster';

import jsonic = require('jsonic');
import { HosterRunnerScrapper, IHosterData, IRunnerScrapperOptions, Scrap } from 'sourcescrapper-core';
import { HtmlRunner, IHtmlRunnerArgs, IHtmlRunnerOptions } from 'sourcescrapper-html-runner';

export interface IMasteranimeHosterData extends IHosterData {
    mirrors: IMirror[];
    hosters: MasteranimeHoster[];
}

export interface IMirror {
    id: number;
    host_id: number;
    embed_id: string;
    quality: number;
    type: number;
    host: IHost;
}
export interface IHost {
    id: number;
    name: string;
    embed_prefix: string;
    embed_suffix: string | null;
}

export type IMasteranimeScrapperOptions = IRunnerScrapperOptions<IHtmlRunnerOptions>;

export class MasteranimeScrapper extends HosterRunnerScrapper<IMasteranimeHosterData> {
    public static Name: string = 'masteranime';
    public static Domains: string[] = ['masterani.me'];
    public static UrlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?masterani\.me\/anime\/watch\/(\d+-(?:\w+-)+\w+)\/(\d+)/i;
    public static DefaultOptions: IMasteranimeScrapperOptions = {};
    public static Runner: HtmlRunner<IMasteranimeHosterData> = new HtmlRunner<IMasteranimeHosterData>();
    public static async scrap(
        url: string,
        options?: IMasteranimeScrapperOptions): Promise<Scrap<IMasteranimeHosterData>> {
        return new MasteranimeScrapper().scrap(url, options);
    }
    public name: string = MasteranimeScrapper.Name;
    public domains: string[] = MasteranimeScrapper.Domains;
    public urlPattern: RegExp = MasteranimeScrapper.UrlPattern;
    public defaultOptions: IMasteranimeScrapperOptions = MasteranimeScrapper.DefaultOptions;
    public runner: HtmlRunner<IMasteranimeHosterData>  = MasteranimeScrapper.Runner;
    protected async execWithArgs({ html }: IHtmlRunnerArgs): Promise<IMasteranimeHosterData> {
        const mirrorsRegex = /mirrors='(.+?)'/i;
        const mirrorsData = mirrorsRegex.exec(html);
        if (mirrorsData === null || mirrorsData.length < 2)
            return Promise.reject(new Error('Unable to find mirrors'));
        const argsString = mirrorsData[1];
        const mirrors = jsonic(argsString) as IMirror[];

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
