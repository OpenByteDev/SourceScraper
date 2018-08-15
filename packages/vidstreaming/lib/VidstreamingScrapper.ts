import { VidstreamingSource } from './VidstreamingSource';

import { IRunnerScrapperOptions, ISourceData, Scrap, SourceRunnerScrapper } from 'sourcescrapper-core';
import { HtmlRunner, IHtmlRunnerArgs, IHtmlRunnerOptions } from 'sourcescrapper-html-runner';

import flatMap = require('flatmap');
import jsonic = require('jsonic');
import removeNewline = require('newline-remove');
import execAll = require('regexp.execall');

export interface IVidstreamingSourceData extends ISourceData<VidstreamingSource> { }

export interface ISetupDataEntry {
    sources: IVSource[];
}

export interface IVSource {
    file: string;
    type: string;
    label: string;
}

function isString(obj: any): obj is string {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

function isNotNull<T>(obj: T | null): obj is T {
    return obj !== null;
}

export type IVidstreamingScrapperOptions = IRunnerScrapperOptions<IHtmlRunnerOptions>;

export class VidstreamingScrapper extends SourceRunnerScrapper<IVidstreamingSourceData> {
    public static Name: string = 'vidstreaming';
    public static Domains: string[] = ['vidstreaming'];
    public static UrlPattern: RegExp =
    /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?vidstreaming\.io\/(streaming|load)\.php\?id=([a-zA-Z]+)=&title=([a-zA-Z0-9+]+)/i;
    public static Runner: HtmlRunner<IVidstreamingSourceData> = new HtmlRunner<IVidstreamingSourceData>();
    public static DefaultOptions: IRunnerScrapperOptions = {};
    public static async scrap(
        url: string,
        options?: IRunnerScrapperOptions): Promise<Scrap<IVidstreamingSourceData>> {
        return new VidstreamingScrapper().scrap(url, options);
    }
    public static async scrapFromArgs(
        args: IHtmlRunnerArgs,
        options?: IRunnerScrapperOptions): Promise<Scrap<IVidstreamingSourceData>> {
        return new VidstreamingScrapper().scrapFromArgs(args, options);
    }
    public name: string = VidstreamingScrapper.Name;
    public domains: string[] = VidstreamingScrapper.Domains;
    public urlPattern: RegExp = VidstreamingScrapper.UrlPattern;
    public runner: HtmlRunner<IVidstreamingSourceData> = VidstreamingScrapper.Runner;
    public defaultOptions: IRunnerScrapperOptions = VidstreamingScrapper.DefaultOptions;
    protected async execWithArgs({ html }: IHtmlRunnerArgs): Promise<IVidstreamingSourceData> {
        const titleregex = /<title>([^<]+)<\/title>/i;
        const dataregex = /playerInstance\.(setup|load)\(({.*?})\)/gi;

        html = removeNewline(html);

        const data: Array<ISetupDataEntry | IVSource> = execAll(dataregex, html)
            .map(match => match !== null && match.length >= 3 ? match[2] : null)
            .filter(isNotNull)
            .map(jsonic)
            .filter(e => e);

        const sources: IVSource[] =
            flatMap(data, e => {
                if (Array.isArray(e.sources))
                    return e.sources;
                else return [e];
            })
            .filter(e => e && e && isString(e.file) && !e.file.includes('error.com'));

        const titles = titleregex.exec(html);

        return {
            title: titles && titles[0] || undefined,
            sources: [...sources]
                .map(e => new VidstreamingSource({
                    url: e.file,
                    label: e.label,
                    type: e.type,
                    quality: undefined,
                    codec: undefined,
                    resolution: undefined
                }))
        };
    }
}
