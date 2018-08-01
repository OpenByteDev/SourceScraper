import { DomRunner, IDomRunnerArgs, IDomRunnerExec, IDomRunnerOptions } from './DomRunner';

import { ISourceData, ISourceScrapper, RunnerScrapper, Scrap, Source } from 'sourcescrapper-core';

export class SimpleDomScrapper extends RunnerScrapper
    <ISourceData, IDomRunnerOptions, IDomRunnerArgs, IDomRunnerExec<ISourceData>, DomRunner<ISourceData>> {
    public static Name: string = 'simpledom';
    public static Domains: string[] = [];
    public static UrlPattern: RegExp = /.*/;
    public name: string =  SimpleDomScrapper.Name;
    public domains: string[] = SimpleDomScrapper.Domains;
    public urlPattern: RegExp = SimpleDomScrapper.UrlPattern;
    protected async runWithArgs({ document }: IDomRunnerArgs): Promise<ISourceData> {
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
