import { Scrapper } from './Scrapper';

export class ScrapperArray<T> extends Array<Scrapper<T>> {
    constructor(length: number)
    constructor(...elements: Array<Scrapper<T>>)
    constructor(...args: any[]) {
        super(...args);
    }

    get domains(): Array<string | RegExp> {
        return this.flatMap<string | RegExp>(e => (Array.isArray(e.domains) ? e.domains : [e.domains]));
    }

    public getAllApplicable(url: string): Array<Scrapper<T>> {
        return this.filter(s => s.isApplicable(url));
    }
    public getFirstApplicable(url: string): Scrapper<T> | undefined {
        return this.find(s => s.isApplicable(url));
    }
    public getByName(name: string): Scrapper<T> | undefined {
        name = name.toLowerCase();
        return this.find(s => s.name.toLowerCase() === name);
    }
    public getByDomain(domain: string): Scrapper<T> | undefined {
        domain = domain.toLowerCase();
        return this.find(s => s.isApplicableDomain(domain));
    }
}
