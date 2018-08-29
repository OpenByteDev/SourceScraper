import { IScraperRunnerOptions, {{cp;type}}Scraper, I{{cp;type}}Data } from 'source-scraper-core';
import { {{cp;runner}}Runner, I{{cp;runner}}RunnerArgs, I{{cp;runner}}RunnerOptions } from 'source-scraper-{{lc;runner}}-runner'

export class {{cp;name}}Scraper extends {{cp;type}}Scraper<I{{cp;type}}Data> {
    public name: string = '{{lc;name}}';
    public domains: string[] = [{{domains}}];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?{{urlPattern}}/i;
    public runner: {{cp;runner}}Runner<I{{cp;type}}Data> = new {{cp;runner}}Runner<I{{cp;type}}Data>();
    public defaultOptions: IScraperRunnerOptions<I{{cp;runner}}RunnerOptions> = {};

    protected async execWithArgs(args: I{{cp;runner}}RunnerArgs): Promise<I{{cp;type}}Data> {
        
    }
}
