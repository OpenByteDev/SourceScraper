import { Scrap, Source, SourceData, SourceScrapper } from 'sourcescrapper-core';
import { PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface OpenloadSourceData extends SourceData {
    streamurl: string;
}
export class OpenloadScrapper extends SourceScrapper<OpenloadSourceData> {
    public static Name: string = 'openload';
    public static Domains: string[] = ['openload.co', 'oload.tv', 'oload.win'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?(openload\.co|oload\.(?:tv|win))\/embed\/(\w+)/i;
    public static async scrap(url: string): Promise<Scrap<OpenloadSourceData>> {
        return new OpenloadScrapper().scrap(url);
    }
    public name: string = OpenloadScrapper.Name;
    public domains: string[] = OpenloadScrapper.Domains;
    public urlPattern: RegExp = OpenloadScrapper.UrlPattern;
    protected async run(url: string): Promise<OpenloadSourceData> {
        return PuppeteerRunner.run(url, async ({ page }) => {
            const streamurl = await page.$eval(
                '[id*=stream], div[style*="display:none"] p:last-of-type',
                e => e.innerText);
            const title = await page.$eval(
                'meta[name="description"], meta[name="og:title"], meta[name="twitter:title"]',
                e => e.content).catch(e => undefined);
            const thumb = await page.$eval(
                'meta[name="og:image"], meta[name="twitter:image"]',
                e => e.content).catch(e => undefined);
            return {
                sources: [new Source({
                    url: `https://openload.co/stream/${await streamurl}?mime=true`
                })],
                title,
                poster: thumb,
                streamurl
            };
        });
    }
}
