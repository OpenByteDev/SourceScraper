import { {{cp;name}}Runner, I{{cp;name}}RunnerArgs, I{{cp;name}}RunnerOptions } from './{{cp;name}}Runner';

import {
    IRunnerScraperOptions, I{{cp;type}}Data, I{{cp;type}}Scraper, Scrap, {{cp;type}}, {{cp;type}}RunnerScraper
} from 'source-scraper-core';

export type ISimple{{cp;name}}ScraperOptions = IRunnerScraperOptions<I{{cp;name}}RunnerOptions>;

export type ISimple{{cp;name}}Scraper{{cp;type}}Data = I{{cp;type}}Data<{{cp;type}}>;

export class Simple{{cp;name}}Scraper
    extends {{cp;type}}RunnerScraper<
        ISimple{{cp;name}}Scraper{{cp;type}}Data,
        I{{cp;name}}RunnerOptions,
        I{{cp;name}}RunnerArgs,
        {{cp;name}}Runner<ISimple{{cp;name}}Scraper{{cp;type}}Data>>
    implements I{{cp;type}}Scraper {

    public name: string = '{{lc;name}}';
    public domains: string[] = [];
    public urlPattern: RegExp = /.*/i;
    public runner: {{cp;name}}Runner<ISimple{{cp;name}}Scraper{{cp;type}}Data> = new {{cp;name}}Runner<ISimple{{cp;name}}Scraper{{cp;type}}Data>();
    public defaultOptions: ISimple{{cp;name}}ScraperOptions = {};

    protected async execWithArgs(args: I{{cp;name}}RunnerArgs): Promise<ISimple{{cp;name}}Scraper{{cp;type}}Data> {

    }
}
