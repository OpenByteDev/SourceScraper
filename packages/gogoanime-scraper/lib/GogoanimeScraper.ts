import { Hoster, HosterRunnerScraper, IHosterData, IRunnerScraperOptions } from 'source-scraper-core';
import { DomRunner, IDomRunnerArgs, IDomRunnerOptions } from 'source-scraper-dom-runner';

export type IGogoanimeScraperOptions = IRunnerScraperOptions<IDomRunnerOptions>;

export type IGogoanimeScraperHosterData = IHosterData<Hoster>;

export class GogoanimeScraper extends HosterRunnerScraper<IGogoanimeScraperHosterData> {
    public name: string = 'gogoanime';
    public domains: string[] = ['gogoanime.se', 'gogoanime.sh'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?gogoanime.(?:sh|se)\/(\w+(?:-\w+)*)/i;
    public runner: DomRunner<IHosterData> = new DomRunner<IHosterData>();
    public defaultOptions: IGogoanimeScraperOptions = {};

    protected async execWithArgs({ document }: IDomRunnerArgs): Promise<IHosterData> {
        const bodies = document.getElementsByTagName('body');
        if (!(bodies.length >= 1))
            return Promise.reject(new Error('Unable to find body element'));
        const body = bodies[0];
        const containers = body.getElementsByClassName('anime_muti_link'); // <-- no typo here
        if (!(containers.length >= 1))
            return Promise.reject(new Error('Unable to find container element'));
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
