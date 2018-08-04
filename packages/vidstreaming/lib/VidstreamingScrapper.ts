import { VidstreamingSource } from './VidstreamingSource';

import { ISourceData, Scrap, SourceRunnerScrapper } from 'sourcescrapper-core';
import { HtmlRunner, IHtmlRunnerArgs } from 'sourcescrapper-html-runner';

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

export class VidstreamingScrapper extends SourceRunnerScrapper<IVidstreamingSourceData> {
    public static Name: string = 'vidstreaming';
    public static Domains: string[] = ['vidstreaming'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?vidstreaming\.io\/embed\/(\w+)/i;
    public static Runner: HtmlRunner<IVidstreamingSourceData> = new HtmlRunner<IVidstreamingSourceData>();
    public static async scrap(url: string): Promise<Scrap<IVidstreamingSourceData>> {
        return new VidstreamingScrapper().scrap(url);
    }
    public static async scrapFromArgs(url: string, args: IHtmlRunnerArgs): Promise<Scrap<IVidstreamingSourceData>> {
        return new VidstreamingScrapper().scrapFromArgs(url, args);
    }
    public name: string = VidstreamingScrapper.Name;
    public domains: string[] = VidstreamingScrapper.Domains;
    public urlPattern: RegExp = VidstreamingScrapper.UrlPattern;
    public runner: HtmlRunner<IVidstreamingSourceData> = VidstreamingScrapper.Runner;
    protected async runWithArgs({ html }: IHtmlRunnerArgs): Promise<IVidstreamingSourceData> {
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
