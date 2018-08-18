import { Hoster, IHoster } from './Hoster';
import { IScrapper, IScrapperOptions, Scrapper } from './Scrapper';

export interface IHosterData<T extends IHoster = Hoster> {
    title?: string;
    hosters: T[];
}

export interface IHosterScrapper<
    T extends IHosterData = IHosterData,
    SO extends IScrapperOptions = IScrapperOptions> extends IScrapper<T, SO> { }

export abstract class HosterScrapper<
    T extends IHosterData = IHosterData,
    SO extends IScrapperOptions = IScrapperOptions> extends Scrapper<T, SO> implements IHosterScrapper<T, SO> { }
