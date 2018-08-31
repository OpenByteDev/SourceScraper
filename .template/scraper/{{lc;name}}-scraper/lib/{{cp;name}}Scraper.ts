import { IScraperOptions, {{cp;type}}Scraper, I{{cp;type}}Data, {{cp;type}} } from 'source-scraper-core';

export type I{{cp;name}}ScraperOptions = IScraperOptions;

export type I{{cp;name}}Scraper{{cp;type}}Data = I{{cp;type}}Data<{{cp;type}}>;

export class {{cp;name}}Scraper extends {{cp;type}}Scraper<I{{cp;name}}Scraper{{cp;type}}Data> {
    public name: string = '{{lc;name}}';
    public domains: string[] = [{{domains}}];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?{{urlPattern}}/i;
    public defaultOptions: I{{cp;name}}ScraperOptions = {};
	
    protected async exec(url: string): Promise<I{{cp;name}}Scraper{{cp;type}}Data> {
        
    }
}
