import { IRunnerScraperOptions, ISourceData, Source, SourceRunnerScraper } from 'source-scraper-core';
import { SimpleDomScraper } from 'source-scraper-dom-runner';
import { HtmlRunner, IHtmlRunnerArgs, IHtmlRunnerOptions } from 'source-scraper-html-runner';

export type IStreamMoeScraperOptions = IRunnerScraperOptions<IHtmlRunnerOptions>;

export interface IStreamMoeScraperSourceData extends ISourceData<Source> {
    decodedPage: string;
}

export class StreamMoeScraper extends SourceRunnerScraper<IStreamMoeScraperSourceData> {
    public name: string = 'streammoe';
    public domains: string[] = ['stream.moe'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?stream\.moe\/embed2\/[0-9a-zA-Z]+/i;
    public runner: HtmlRunner<IStreamMoeScraperSourceData> = new HtmlRunner<IStreamMoeScraperSourceData>();
    public defaultOptions: IStreamMoeScraperOptions = {};

    protected async execWithArgs(
        { html, url }: IHtmlRunnerArgs,
        options: IStreamMoeScraperOptions): Promise<IStreamMoeScraperSourceData> {
        const encodedDataRegex = /atob\((['"])(.*?)\1\)/i;
        const encodedData = encodedDataRegex.exec(html);
        if (encodedData === null || encodedData.length < 3)
            return Promise.reject(null);
        const encoded = encodedData[2];
        const decoded = Buffer.from(encoded, 'base64').toString('ascii');
        const scrap = await new SimpleDomScraper().scrapFromHtml(url, decoded, undefined, options);
        if (!scrap.success || typeof scrap.data === 'undefined')
            return Promise.reject(null);
        const titleRegex = /<title[^>]*>\s*(?:\[.*?])\s*(.*?)\s*(?:\[.*?]).*?<\/title>/i;
        const titleData = titleRegex.exec(html);
        const title = titleData !== null && titleData.length >= 1 ? titleData[0] : undefined;
        return {
            ...scrap.data,
            title,
            decodedPage: decoded,
        };
    }
}
