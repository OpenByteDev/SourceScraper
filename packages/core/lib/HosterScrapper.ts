import { Hoster, IHoster } from './Hoster';
import { IScrapper, Scrapper } from './Scrapper';

export interface IHosterData<T extends IHoster = Hoster> {
    title?: string;
    hosters: T[];
}

export interface IHosterScrapper<T extends IHosterData = IHosterData> extends IScrapper<T> { }

export abstract class HosterScrapper<T extends IHosterData = IHosterData>
    extends Scrapper<T> implements IHosterScrapper<T> { }
