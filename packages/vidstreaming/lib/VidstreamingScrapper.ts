import { VidstreamingSource } from './VidstreamingSource';

import { Scrap, SourceData, SourceScrapper } from 'sourcescrapper-core';
import { HtmlRunner } from 'sourcescrapper-html-runner';

import jsonic = require('jsonic');
import removeNewline = require('newline-remove');

export interface VidstreamingSourceData extends SourceData {
    setupData: SetupDataEntry[];
}
export interface SetupDataEntry {
    sources: VSource[];
    tracks: Track[];
    image: string;
    file: string;
    type: string;
    label: string;
}
export interface VSource {
    file: string;
    type: string;
    label: string;
}
export interface Track {
    kind: 'thumbnail' | string;
    file: string;
}
function isString(obj: any): obj is string {
    return (Object.prototype.toString.call(obj) === '[object String]');
}
function isNotNull<T>(obj: T | null): obj is T {
    return obj !== null;
}
export class VidstreamingScrapper extends SourceScrapper<VidstreamingSourceData> {
    public static Name: string = 'vidstreaming';
    public static Domains: string[] = ['vidstreaming'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?vidstreaming\.io\/embed\/(\w+)/i;
    public static async scrap(url: string): Promise<Scrap<VidstreamingSourceData>> {
        return new VidstreamingScrapper().scrap(url);
    }
    public name: string = VidstreamingScrapper.Name;
    public domains: string[] = VidstreamingScrapper.Domains;
    public urlPattern: RegExp = VidstreamingScrapper.UrlPattern;
    protected async run(url: string): Promise<VidstreamingSourceData> {
        return HtmlRunner.run(url, async ({ html }) => {
            const titleregex = /<title>([^<]+)<\/title>/i;
            const dataregex = /playerInstance\.(setup|load)\(({.*?})\)/gi;

            html = removeNewline(html);

            const data: SetupDataEntry[] = dataregex.execAll(html)
                .map(match => match !== null && match.length >= 3 ? match[2] : null)
                .filter(isNotNull)
                .map(e => jsonic(e))
                .filter(e => e);

            const sources = new Set(data
                .filter(e => Array.isArray(e.sources) && e.sources.length > 0)
                .flatMap(e => e.sources)
                .filter(e => e && e && isString(e.file) && !e.file.includes('error.com')));

            const images = new Set(data
                .filter(e => e.image)
                .map(e => e.image));

            const titles = titleregex.exec(html);

            return {
                title: titles && titles[0] || undefined,
                sources: [...sources]
                    .filter(e => e && e.file && isString(e.file))
                    .map(e => new VidstreamingSource(e)),
                poster: images[0] as string || undefined,
                setupData: data
            };
        });
    }
}
