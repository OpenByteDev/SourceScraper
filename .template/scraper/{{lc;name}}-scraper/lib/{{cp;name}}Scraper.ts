import { IScraperOptions, {{cp;type}}Scraper, I{{cp;type}}Data } from 'source-scraper-core';

export class {{cp;name}}Scraper extends {{cp;type}}Scraper<I{{cp;type}}Data> {
    public name: string = '{{lc;name}}';
    public domains: string[] = [{{domains}}];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?{{urlPattern}}/i;
    public defaultOptions: IScraperOptions = {};
	
    protected async exec(ur: string): Promise<I{{cp;type}}Data> {
        
    }
}
