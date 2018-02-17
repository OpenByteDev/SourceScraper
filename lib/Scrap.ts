import { Info } from './Info';
import { Scrapper } from './Scrapper';

export class Scrap {
    public info: Info | null;
    public url: string;
    public scrapper: string;

    constructor({ info, url, scrapper }: {info: Info | null, url: string, scrapper: Scrapper}) {
        this.info = info;
        this.url = url;
        this.scrapper = scrapper.name;
    }
}
