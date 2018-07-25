import { PuppeteerRunner } from './PuppeteerRunner';

import { Scrap, Source, SourceData, SourceScrapper } from 'sourcescrapper-core';

export class SimplePuppeteerScrapper extends SourceScrapper {
    public static Name: string = 'puppeteer';
    public static Domains: string[] = [];
    public static UrlPattern = /.*/;
    public static async scrap(url: string): Promise<Scrap<SourceData>> {
        return new SimplePuppeteerScrapper().scrap(url);
    }
    public name: string = 'puppeteer';
    public domains: string[] = [];
    public urlPattern = /.*/;
    protected async run(url: string): Promise<SourceData> {
        return PuppeteerRunner.run<SourceData>(url, ({ page }) => {
            return page.evaluate(() => {
                const data: SourceData = {
                    sources: []
                };
                const videos = document.getElementsByTagName('video');
                for (const video of videos) {
                    const vsrc = video.src;
                    if (vsrc)
                        data.sources.push(new Source({
                            url: vsrc,
                            type: video.getAttribute('type') || undefined
                        }));
                    const poster = video.poster;
                    if (poster)
                        data.poster = poster;
                    const sources = video.getElementsByTagName('source');
                    for (const source of sources) {
                        const ssrc = source.src;
                        if (ssrc)
                            data.sources.push(new Source({
                                url: ssrc,
                                type: source.getAttribute('type') || undefined
                            }));
                    }
                }
                const titles = document.getElementsByTagName('title');
                if (titles.length >= 1)
                    data.title = titles[0].innerText;
                return Promise.resolve(data);
            });
        });
    }
}
