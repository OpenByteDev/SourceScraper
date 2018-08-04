import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from './PuppeteerRunner';

import { ISourceData, ISourceScrapper, Source, SourceRunnerScrapper } from 'sourcescrapper-core';

export class SimplePuppeteerScrapper
    extends SourceRunnerScrapper<
        ISourceData,
        IPuppeteerRunnerOptions,
        IPuppeteerRunnerArgs,
        PuppeteerRunner<ISourceData>>
    implements ISourceScrapper {
    public static Name: string = 'puppeteer';
    public static Domains: string[] = [];
    public static UrlPattern: RegExp = /.*/;
    public static Runner: PuppeteerRunner<ISourceData> = new PuppeteerRunner<ISourceData>();
    public name: string = SimplePuppeteerScrapper.Name;
    public domains: string[] = SimplePuppeteerScrapper.Domains;
    public urlPattern: RegExp = SimplePuppeteerScrapper.UrlPattern;
    public runner: PuppeteerRunner<ISourceData> = SimplePuppeteerScrapper.Runner;
    protected async runWithArgs({ page }: IPuppeteerRunnerArgs): Promise<ISourceData> {
        // tslint:disable-next-line no-shadowed-variable
        return page.evaluate(async Source => {
            const data: ISourceData = {
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
        }, Source);
    }
}
