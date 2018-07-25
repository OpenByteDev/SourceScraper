import { StreamangoSource } from './StreamangoSource';

import { Scrap, SourceData, SourceScrapper } from 'sourcescrapper-core';
import { PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface StreamangoSourceData extends SourceData {
    sources: StreamangoSource[];
}
export class StreamangoScrapper extends SourceScrapper<StreamangoSourceData> {
    public static Name: string = 'streamango';
    public static Domains: string[] = ['streamango.com'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?streamango\.com\/embed\/(\w+)\/(.+)/i;
    public static async scrap(url: string): Promise<Scrap<StreamangoSourceData>> {
        return new StreamangoScrapper().scrap(url);
    }
    public name: string = StreamangoScrapper.Name;
    public domains: string[] = StreamangoScrapper.Domains;
    public urlPattern: RegExp = StreamangoScrapper.UrlPattern;
    protected async run(url: string): Promise<StreamangoSourceData> {
        return PuppeteerRunner.run(url, async ({ page }) => {
            // tslint:disable-next-line
            let srces; // remove typescript error "cannot find name 'srces'"
            const srcs = await page.evaluate(() => {
                for (const script of document.getElementsByTagName('script')) {
                    if (script.src)
                        continue;
                    if (script.text.includes('srces.push')) {
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
        });
    }
}
