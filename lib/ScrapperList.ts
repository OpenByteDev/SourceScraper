import { Scrapper } from './Scrapper';

export class ScrapperList extends Array<Scrapper> {
    constructor(length: number)
    constructor(...elements: Scrapper[])
    constructor(...args: any[]) {
        super(...args);
    }

    get hosters(): string[] {
        return this.flatMap((e) => e.domain);
    }

    public getAllApplicable(url: string): Scrapper[] {
        return this.filter((s) => s.isApplicable(url));
    }
    public getFirstApplicable(url: string): Scrapper | undefined {
        return this.find((s) => s.isApplicable(url));
    }
    public getByName(name: string): Scrapper | undefined {
        name = name.toLowerCase();
        return this.find((s) => s.name.toLowerCase() === name);
    }
}
