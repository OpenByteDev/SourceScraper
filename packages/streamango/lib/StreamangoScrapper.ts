import { StreamangoSource } from './StreamangoSource';

import { ISourceData, Scrap, SourceRunnerScrapper } from 'sourcescrapper-core';
import { IPuppeteerRunnerArgs, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface IStreamangoSourceData extends ISourceData {
    sources: StreamangoSource[];
}

export class StreamangoScrapper extends SourceRunnerScrapper<IStreamangoSourceData> {
    public static Name: string = 'streamango';
    public static Domains: string[] = ['streamango.com'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?streamango\.com\/embed\/(\w+)\/(.+)/i;
    public static Runner: PuppeteerRunner<IStreamangoSourceData> = new PuppeteerRunner<IStreamangoSourceData>();
    public static async scrap(url: string): Promise<Scrap<IStreamangoSourceData>> {
        return new StreamangoScrapper().scrap(url);
    }
    public static async scrapFromArgs(url: string, args: IPuppeteerRunnerArgs): Promise<Scrap<IStreamangoSourceData>> {
        return new StreamangoScrapper().scrapFromArgs(url, args);
    }
    public name: string = StreamangoScrapper.Name;
    public domains: string[] = StreamangoScrapper.Domains;
    public urlPattern: RegExp = StreamangoScrapper.UrlPattern;
    public runner: PuppeteerRunner<IStreamangoSourceData> = StreamangoScrapper.Runner;
    protected async runWithArgs({ page }: IPuppeteerRunnerArgs): Promise<IStreamangoSourceData> {
        // tslint:disable-next-line
        let srces; // remove typescript error "cannot find name 'srces'"
        const srcs = await page.evaluate(() => {
            for (const script of document.getElementsByTagName('script')) {
                if (script.src)
                    continue;
                if (script.text.includes('srces.push')) {
                    // tslint:disable-next-line
                    eval(script.innerText);
                    return srces;
                }
            }
        });
        return ({
            sources: srcs.map((s) => new StreamangoSource({
                url: s.src,
                type: s.type,
                resolution: s.height,
                height: s.height,
                bitrate: s.bitrate
            }))
        });
    }
}
