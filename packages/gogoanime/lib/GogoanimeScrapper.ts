import { Hoster, HosterRunnerScrapper, IHosterData, Scrap } from 'sourcescrapper-core';
import { DomRunner, IDomRunnerArgs } from 'sourcescrapper-dom-runner';

export class GogoanimeScrapper extends HosterRunnerScrapper<IHosterData> {
    public static Name: string = 'gogoanime';
    public static Domains: string[] = ['gogoanime.se', 'gogoanime.sh'];
    public static UrlPattern: RegExp = /https?:\/\/(?:www\.)?gogoanime.(sh|se)\/(\w+(?:-\w+)*)/i;
    public static Runner: DomRunner<IHosterData> = new DomRunner<IHosterData>();
    public static async scrap(url: string): Promise<Scrap<IHosterData>> {
        return new GogoanimeScrapper().scrap(url);
    }
    public static async scrapFromArgs(args: IDomRunnerArgs): Promise<Scrap<IHosterData>> {
        return new GogoanimeScrapper().scrapFromArgs(args);
    }
    public name: string = GogoanimeScrapper.Name;
    public domains: string[] = GogoanimeScrapper.Domains;
    public urlPattern: RegExp = GogoanimeScrapper.UrlPattern;
    public runner: DomRunner<IHosterData> = GogoanimeScrapper.Runner;
    protected async runWithArgs({ document }: IDomRunnerArgs): Promise<IHosterData> {
        const bodies = document.getElementsByTagName('body');
        if (!(bodies.length >= 1))
            return Promise.reject(null);
        const body = bodies[0];
        const containers = body.getElementsByClassName('anime_muti_link'); // <-- no typo here
        if (!(containers.length >= 1))
            return Promise.reject(null);
        const container = containers[0];
        const items = container.getElementsByTagName('li');
        const hosters: Hoster[] = [];
        for (const item of items) {
            const links = item.getElementsByTagName('a');
            if (!(links.length >= 1))
                continue;
            const link = links[0];
            const url = link.getAttribute('data-video');
            if (!url)
                continue;
            let name = link.textContent;
            if (!name)
                continue;
            const spans = link.getElementsByTagName('span');
            if (spans.length >= 1) {
                const span = spans[0];
                if (span.textContent)
                    name = name.replace(span.textContent, '');
            }
            name = name.trim();
            hosters.push(new Hoster({
                url,
                name
            }));
        }
        const titles = document.getElementsByTagName('title');
        const title = titles.length >= 1 ? titles[0].textContent || undefined : undefined;
        return {
            hosters,
            title
        };
    }
}
