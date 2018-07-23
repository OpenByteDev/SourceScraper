import { Hoster } from './Hoster';
import { Scrapper } from './Scrapper';

export interface HosterData {
    title?: string;
    hosters: Hoster[];
}
export abstract class HosterScrapper extends Scrapper<HosterData> {
    public abstract run(url: string): Promise<HosterData>;
}
