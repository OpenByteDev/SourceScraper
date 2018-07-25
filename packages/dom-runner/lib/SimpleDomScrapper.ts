import { DomRunner } from './DomRunner';

import { Scrap, Source, SourceData, SourceScrapper } from 'sourcescrapper-core';

export class SimpleDomScrapper extends SourceScrapper {
    public static Name: string = 'simpledom';
    public static Domains: string[] = [];
    public static UrlPattern: RegExp = /.*/;
    public static async scrap(url: string): Promise<Scrap<SourceData>> {
        return new SimpleDomScrapper().scrap(url);
    }
    public name: string =  SimpleDomScrapper.Name;
    public domains: string[] = SimpleDomScrapper.Domains;
    public urlPattern: RegExp = SimpleDomScrapper.UrlPattern;
    protected async run(url: string): Promise<SourceData> {
        return DomRunner.run<SourceData>(url, ({ dom }) => {
            const data: SourceData = {
                sources: []
            };
            const videos = dom.getElementsByTagName('video');
            for (const video of videos) {
                const vsrc = video.attrs.src;
                if (vsrc)
                    data.sources.push(new Source({
                        url: vsrc,
                        type: video.attrs.type
                    }));
                const poster = video.attrs.poster;
                if (poster)
                    data.poster = poster;
                const sources = video.getElementsByTagName('source');
                for (const source of sources) {
                    const ssrc = source.attrs.src;
                    if (ssrc)
                        data.sources.push(new Source({
                            url: ssrc,
                            type: source.attrs.type
                        }));
                }
            }
            const titles = dom.getElementsByTagName('title');
            if (titles.length >= 1)
                data.title = titles[0].getText();
            return Promise.resolve(data);
        });
    }
}
