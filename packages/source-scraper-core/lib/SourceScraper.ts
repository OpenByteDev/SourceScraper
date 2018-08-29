import { IScraper, IScraperOptions, Scraper } from './Scraper';
import { ISource, Source } from './Source';

export interface ISourceData<T extends ISource = Source> {
    poster?: string;
    title?: string;
    sources: T[];
}

export interface ISourceScraper<
    T extends ISourceData = ISourceData,
    SO extends IScraperOptions = IScraperOptions> extends IScraper<T, SO> { }

export abstract class SourceScraper<
    T extends ISourceData = ISourceData,
    SO extends IScraperOptions = IScraperOptions> extends Scraper<T, SO> implements ISourceScraper<T, SO> { }
