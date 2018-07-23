import { Source, SourceData, SourceScrapper } from 'sourcescrapper-core';

import { PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface VidziSourceData extends SourceData {
    jwplayerConfig: any;
}
export class VidziScrapper extends SourceScrapper {
    public name: string = 'vidzi';
    public domains: string[] = ['vidzi.tv', 'vidzi.online', 'vidzi.nu'];
    public urlPattern: RegExp = /https?:\/\/(?:www\.)?vidzi\.(?:tv|online|nu)\/(\w+)\.html/;
    public async run(url: string): Promise<SourceData> {
        return PuppeteerRunner.run(url, async ({page}) => {
            // tslint:disable-next-line
            let jwplayer; // remove typescript error "cannot find name 'jwplayer'"
            const config = await page.evaluate(() => jwplayer().getConfig());
            const playlistItem = config.playlistItem;
            const title = await page.$eval('.video-title', (t) => t.innerText);
            return {
                jwplayerConfig: config,
                poster: playlistItem.image,
                title,
                source: playlistItem.allSources.map((s) => new Source({
                    url: s.file,
                    type: s.type
                }))
            };
        });
    }
}
