import { Scrapper } from "./Scrapper";


export class ScrapperList extends Array<Scrapper> {
    constructor(length: number)
    constructor(...elements: Scrapper[])
    constructor(...args: any[]) {
        super(...args);
    }

    get hosters(): string[] {
        return this.flatMap(e => e.domain);
    }

    getAllApplicable(url: string): Scrapper[] {
        return this.filter(s => s.isApplicable(url));
    }
    getFirstApplicable(url: string): Scrapper|undefined {
        return this.find(s => s.isApplicable(url));
    }
    getByName(name: string): Scrapper|undefined {
        return this.find(s => s.name === name);
    }
}