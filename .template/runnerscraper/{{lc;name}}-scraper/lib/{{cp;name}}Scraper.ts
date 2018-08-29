import { IRunnerScraperOptions, {{cp;type}}Scraper, I{{cp;type}}Data, {{cp;type}} } from 'source-scraper-core';
import { {{cp;runner}}Runner, I{{cp;runner}}RunnerArgs, I{{cp;runner}}RunnerOptions } from 'source-scraper-{{lc;runner}}-runner';

export type I{{cp;name}}ScraperOptions = IRunnerScraperOptions<I{{cp;runner}}RunnerOptions>;

export type I{{cp;name}}Scraper{{cp;type}}Data = I{{cp;type}}Data<{{cp;type}}>;

export class {{cp;name}}Scraper extends {{cp;type}}Scraper<I{{cp;name}}Scraper{{cp;type}}Data> {
    public name: string = '{{lc;name}}';
    public domains: string[] = [{{domains}}];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?{{urlPattern}}/i;
    public runner: {{cp;runner}}Runner<I{{cp;type}}Data> = new {{cp;runner}}Runner<I{{cp;type}}Data>();
    public defaultOptions: I{{cp;name}}ScraperOptions = {};

    protected async execWithArgs(args: I{{cp;runner}}RunnerArgs): Promise<I{{cp;type}}Data> {
        
    }
}
