import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from './PuppeteerRunner';

import {
    IRunnerScraperOptions, ISourceData, ISourceScraper, Source, SourceRunnerScraper
} from 'source-scraper-core';

export type ISimplePuppeteerScraperOptions = IRunnerScraperOptions<IPuppeteerRunnerOptions>;

export type ISimplePuppeteerScraperSourceData = ISourceData<Source>;

export class SimplePuppeteerScraper
    extends SourceRunnerScraper<
        ISimplePuppeteerScraperSourceData,
        IPuppeteerRunnerOptions,
        IPuppeteerRunnerArgs,
        PuppeteerRunner<ISimplePuppeteerScraperSourceData>>
    implements ISourceScraper {

    public name: string = 'puppeteer';
    public domains: string[] = [];
    public urlPattern: RegExp = /.*/i;
    public runner: PuppeteerRunner<ISimplePuppeteerScraperSourceData> =
        new PuppeteerRunner<ISimplePuppeteerScraperSourceData>();
    public defaultOptions: ISimplePuppeteerScraperOptions = {};
    protected async execWithArgs({ page }: IPuppeteerRunnerArgs): Promise<ISimplePuppeteerScraperSourceData> {
        const raw = await page.evaluate(async () => {
            const sdata: {
                title?: string,
                poster?: string,
                sources: Array<{ url: string, type: string | null }>
            } = {
                sources: []
            };
            const videos = document.getElementsByTagName('video');
            for (const video of videos) {
                const source_attr = video.src;
                if (source_attr)
                    sdata.sources.push({
                        url: source_attr,
                        type: video.getAttribute('type')
                    });
                const poster = video.poster;
                if (poster)
                    sdata.poster = poster;
                const source_tags = video.getElementsByTagName('source');
                for (const source of source_tags) {
                    const ssrc = source.src;
                    if (ssrc)
                        sdata.sources.push({
                            url: ssrc,
                            type: source.getAttribute('type')
                        });
                }
            }
            const titles = document.getElementsByTagName('title');
            if (titles.length >= 1)
                sdata.title = titles[0].innerText;
            return Promise.resolve(sdata);
        });
        return {
            poster: raw.poster,
            title: raw.title,
            sources: raw.sources.map(e => new Source({
                url: e.url,
                type: e || undefined
            }))
        };
    }
}
