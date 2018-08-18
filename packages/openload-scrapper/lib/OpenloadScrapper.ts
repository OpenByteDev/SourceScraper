import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';
import { IRunnerScrapperOptions, ISourceData, Scrap, Source, SourceRunnerScrapper } from '../../sourcescrapper-core';

export interface IOpenloadSourceData extends ISourceData {
    streamurl: string;
}

export type IOpenloadScrapperOptions = IRunnerScrapperOptions<IPuppeteerRunnerOptions>;

export class OpenloadScrapper extends SourceRunnerScrapper<IOpenloadSourceData> {
    public static Name: string = 'openload';
    public static Domains: string[] = ['openload.co', 'oload.tv', 'oload.win'];
    public static UrlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(openload\.co|oload\.(?:tv|win))\/embed\/(\w+)/i;
    public static Runner: PuppeteerRunner<IOpenloadSourceData> = new PuppeteerRunner<IOpenloadSourceData>();
    public static DefaultOptions: IOpenloadScrapperOptions = {};
    public static async scrap(
        url: string,
        options?: IOpenloadScrapperOptions): Promise<Scrap<IOpenloadSourceData>> {
        return new OpenloadScrapper().scrap(url, options);
    }
    public static async scrapFromArgs(
        args: IPuppeteerRunnerArgs,
        options?: IOpenloadScrapperOptions): Promise<Scrap<IOpenloadSourceData>> {
        return new OpenloadScrapper().scrapFromArgs(args, options);
    }
    public name: string = OpenloadScrapper.Name;
    public domains: string[] = OpenloadScrapper.Domains;
    public urlPattern: RegExp = OpenloadScrapper.UrlPattern;
    public runner: PuppeteerRunner<IOpenloadSourceData> = OpenloadScrapper.Runner;
    public defaultOptions: IOpenloadScrapperOptions = OpenloadScrapper.DefaultOptions;
    protected async execWithArgs({ page }: IPuppeteerRunnerArgs): Promise<IOpenloadSourceData> {
        const streamurl = await page.$eval(
            '[id*=stream], div[style*="display:none"] p:last-of-type',
            e => e.innerHTML);
        const title = await page.$eval(
            'meta[name="description"], meta[name="og:title"], meta[name="twitter:title"]',
            e => e.innerHTML).catch(() => undefined);
        const thumb = await page.$eval(
            'meta[name="og:image"], meta[name="twitter:image"]',
            e => e.innerHTML).catch(() => undefined);
        return {
            sources: [new Source({
                url: `https://openload.co/stream/${await streamurl}?mime=true`
            })],
            title,
            poster: thumb,
            streamurl
        };
    }
}
