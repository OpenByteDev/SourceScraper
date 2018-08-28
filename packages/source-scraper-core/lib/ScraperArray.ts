import { Scraper } from './Scraper';

import flatMap from 'lodash.flatmap';

export class ScraperArray<T> extends Array<Scraper<T>> {
    constructor(length: number)
    constructor(...elements: Array<Scraper<T>>)
    constructor(...args: any[]) {
        super(...args);
    }

    get domains(): string[] {
        return flatMap(this, s => s.domains);
    }

    public getAllApplicable(url: string): Array<Scraper<T>> {
        return this.filter(s => s.isApplicable(url));
    }
    public getFirstApplicable(url: string): Scraper<T> | undefined {
        return this.find(s => s.isApplicable(url));
    }
    public allApplicable(url: string): boolean {
        return this.every(s => s.isApplicable(url));
    }
    public getByName(name: string): Scraper<T> | undefined {
        name = name.toLowerCase();
        return this.find(s => s.name.toLowerCase() === name);
    }
    public getByDomain(domain: string): Scraper<T> | undefined {
        domain = domain.toLowerCase();
        return this.find(s => s.isApplicableDomain(domain));
    }
}
