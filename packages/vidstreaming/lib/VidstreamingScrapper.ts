import { Source, SourceData, SourceScrapper } from 'sourcescrapper-core';
import { HtmlRunner } from 'sourcescrapper-html-runner';

import jsonic = require('jsonic');
import removeNewline = require('newline-remove');

export interface VidstreamingSourceData extends SourceData {
    setupData: SetupDataEntry[];
}
export interface SetupDataEntry {
    sources: VSSource[];
    tracks: Track[];
    image: string;
    file: string;
    type: string;
    label: string;
}
export interface VSSource {
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
export class VidstreamingScrapper extends SourceScrapper {
    public name: string = 'openload';
    public domains: string[] = ['openload.co', 'oload.tv', 'oload.win'];
    public urlPattern: RegExp = /https?:\/\/(www\.)?(openload\.co|oload\.(?:tv|win))\/embed\/(\w+)/i;
    public async run(url: string): Promise<VidstreamingSourceData> {
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
                    .map(e => new Source({
                    url: e.file,
                    type: e.type
                })),
                poster: images[0] as string || undefined,
                setupData: data
            };
        });
    }
}
