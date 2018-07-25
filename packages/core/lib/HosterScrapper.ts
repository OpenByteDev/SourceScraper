import { Hoster } from './Hoster';
import { Scrapper } from './Scrapper';

export interface HosterData<T extends Hoster = Hoster> {
    title?: string;
    hosters: T[];
}
export abstract class HosterScrapper<T extends HosterData = HosterData> extends Scrapper<T> {
}
