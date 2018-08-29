import { Hoster, IHoster } from './Hoster';
import { IScraper, IScraperOptions, Scraper } from './Scraper';

export interface IHosterData<T extends IHoster = Hoster> {
    title?: string;
    hosters: T[];
}

export interface IHosterScraper<
    T extends IHosterData = IHosterData,
    SO extends IScraperOptions = IScraperOptions> extends IScraper<T, SO> { }

export abstract class HosterScraper<
    T extends IHosterData = IHosterData,
    SO extends IScraperOptions = IScraperOptions> extends Scraper<T, SO> implements IHosterScraper<T, SO> { }
