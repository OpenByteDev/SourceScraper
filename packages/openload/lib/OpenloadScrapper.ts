import { Source,SourceData, SourceScrapper } from 'sourcescrapper-core';

import { PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface OpenloadSourceData extends SourceData {
    streamurl: string;
}
export class OpenloadScrapper extends SourceScrapper {
    public name: string = 'openload';
    public domains: string[] = ['openload.co', 'oload.tv', 'oload.win'];
    public urlPattern: RegExp = /https?:\/\/(openload\.co|oload\.(?:tv|win))\/embed\/(\w+)/;
    public async run(url: string): Promise<OpenloadSourceData> {
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
