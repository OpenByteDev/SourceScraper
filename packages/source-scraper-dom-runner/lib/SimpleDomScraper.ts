import { DomRunner, IDomRunnerArgs, IDomRunnerOptions } from './DomRunner';

import {
    IRunnerScraperOptions, ISourceData, ISourceScraper, Scrap, Source, SourceRunnerScraper
} from 'source-scraper-core';

import { ConstructorOptions as JSDOMOptions, JSDOM } from 'jsdom';

export type ISimpleDomScraperOptions = IRunnerScraperOptions<IDomRunnerOptions>;

export type ISimpleDomScraperSourceData = ISourceData<Source>;

export class SimpleDomScraper
    extends SourceRunnerScraper<
        ISimpleDomScraperSourceData,
        IDomRunnerOptions,
        IDomRunnerArgs,
        DomRunner<ISimpleDomScraperSourceData>>
    implements ISourceScraper<ISimpleDomScraperSourceData> {

    public name: string = 'dom';
    public domains: string[] = [];
    public urlPattern: RegExp = /.*/i;
    public runner: DomRunner<ISimpleDomScraperSourceData> = new DomRunner<ISimpleDomScraperSourceData>();
    public defaultOptions: ISimpleDomScraperOptions = {};

    public async scrapFromHtml(
        url: string,
        html: string,
        jsdomOptions?: JSDOMOptions,
        options?: ISimpleDomScraperOptions): Promise<Scrap<ISimpleDomScraperSourceData>> {
        const jsdom = new JSDOM(html, jsdomOptions);
        return this.scrapFromArgs({
            url,
            jsdom,
            window: jsdom.window,
            document: jsdom.window.document
        }, options);
    }

    protected async execWithArgs({ document }: IDomRunnerArgs): Promise<ISimpleDomScraperSourceData> {
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
                        type: video.getAttribute('type') || undefined
                    }));
            }
        }
        const titles = document.getElementsByTagName('title');
        if (titles.length >= 1)
            data.title = titles[0].innerText;
        return Promise.resolve(data);
    }
}
