import { ISourceData, Scrap, SourceRunnerScrapper } from 'sourcescrapper-core';
import { SimpleDomScrapper } from 'sourcescrapper-dom-runner';
import { HtmlRunner, IHtmlRunnerArgs, IHtmlRunnerOptions } from 'sourcescrapper-html-runner';

export interface IStreamMoeSourceData extends ISourceData {
    decodedPage: string;
}

export class StreamMoeScrapper extends SourceRunnerScrapper<IStreamMoeSourceData> {
    public static Name: string = 'streammoe';
    public static Domains: string[] = ['stream.moe'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?stream\.moe\/embed2\/[0-9a-zA-Z]+/i;
    public static Runner: HtmlRunner<IStreamMoeSourceData> = new HtmlRunner<IStreamMoeSourceData>();
    public static RunnerOptions?: IHtmlRunnerOptions = undefined;
    public static async scrap(url: string): Promise<Scrap<IStreamMoeSourceData>> {
        return new StreamMoeScrapper().scrap(url);
    }
    public static async scrapFromArgs(args: IHtmlRunnerArgs): Promise<Scrap<IStreamMoeSourceData>> {
        return new StreamMoeScrapper().scrapFromArgs(args);
    }
    public name: string = StreamMoeScrapper.Name;
    public domains: string[] = StreamMoeScrapper.Domains;
    public urlPattern: RegExp = StreamMoeScrapper.UrlPattern;
    public runner: HtmlRunner<IStreamMoeSourceData> = StreamMoeScrapper.Runner;
    public runnerOptions?: IHtmlRunnerOptions = StreamMoeScrapper.RunnerOptions;
    protected async runWithArgs({ html, url }: IHtmlRunnerArgs): Promise<IStreamMoeSourceData> {
        const encodedDataRegex = /atob\((['"])(.*?)\1\)/i;
        const encodedData = encodedDataRegex.exec(html);
        if (encodedData === null || encodedData.length < 3)
            return Promise.reject(null);
        const encoded = encodedData[2];
        const decoded = Buffer.from(encoded, 'base64').toString('ascii');
        const scrap = await SimpleDomScrapper.scrapFromHtml(url, decoded);
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
