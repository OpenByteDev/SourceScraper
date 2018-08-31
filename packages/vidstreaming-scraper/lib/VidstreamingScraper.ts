import { VidstreamingSource } from './VidstreamingSource';

import { IRunnerScraperOptions, ISourceData, SourceRunnerScraper } from 'source-scraper-core';
import { HtmlRunner, IHtmlRunnerArgs, IHtmlRunnerOptions } from 'source-scraper-html-runner';

import jsonic = require('jsonic');
import flatMap from 'lodash.flatmap';
import removeNewline = require('newline-remove');
import execAll = require('regexp.execall');

function isString(obj: any): obj is string {
    return (Object.prototype.toString.call(obj) === '[object String]');
}

function isNotNull<T>(obj: T | null): obj is T {
    return obj !== null;
}

export interface IVidstreamingJWPlayerSetupDataEntry {
    sources: IVidstreamingConfigSource[];
}

export interface IVidstreamingConfigSource {
    file: string;
    type: string;
    label: string;
}

export type IVidstreamingScraperOptions = IRunnerScraperOptions<IHtmlRunnerOptions>;

export type IVidstreamingScraperSourceData = ISourceData<VidstreamingSource>;

export class VidstreamingScraper extends SourceRunnerScraper<IVidstreamingScraperSourceData> {
    public name: string = 'vidstreaming';
    public domains: string[] = ['vidstreaming.io'];
    public urlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?vidstreaming\.io\/(streaming|load)\.php\?id=(\w+)=&title=([\w+]+)/i;
    public runner: HtmlRunner<IVidstreamingScraperSourceData> = new HtmlRunner<IVidstreamingScraperSourceData>();
    public defaultOptions: IVidstreamingScraperOptions = {};

    protected async execWithArgs({ html }: IHtmlRunnerArgs): Promise<IVidstreamingScraperSourceData> {
        const titleregex = /<title>([^<]+)<\/title>/i;
        const dataregex = /playerInstance\.(setup|load)\(({.*?})\)/gi;

        html = removeNewline(html);

        const data: Array<IVidstreamingJWPlayerSetupDataEntry | IVidstreamingConfigSource> = execAll(dataregex, html)
            .map(match => match !== null && match.length >= 3 ? match[2] : null)
            .filter(isNotNull)
            .map(jsonic)
            .filter(e => e);

        const sources: IVidstreamingConfigSource[] =
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
