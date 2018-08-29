import { IRunnerScraperOptions, ISourceData, Source, SourceRunnerScraper } from 'source-scraper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'source-scraper-puppeteer-runner';

export type IOpenloadScraperOptions = IRunnerScraperOptions<IPuppeteerRunnerOptions>;

export interface IOpenloadScraperSourceData extends ISourceData<Source> {
    streamurl: string;
}
export class OpenloadScraper extends SourceRunnerScraper<IOpenloadScraperSourceData> {
    public name: string = 'openload';
    public domains: string[] = ['openload.co', 'oload.tv', 'oload.win'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(openload\.co|oload\.(?:tv|win))\/embed\/(\w+)/i;
    public runner: PuppeteerRunner<IOpenloadScraperSourceData> = new PuppeteerRunner<IOpenloadScraperSourceData>();
    public defaultOptions: IOpenloadScraperOptions = {};

    protected async execWithArgs({ page }: IPuppeteerRunnerArgs): Promise<IOpenloadScraperSourceData> {
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
