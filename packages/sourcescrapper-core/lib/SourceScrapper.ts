import { IScrapper, IScrapperOptions, Scrapper } from './Scrapper';
import { ISource, Source } from './Source';

export interface ISourceData<T extends ISource = Source> {
    poster?: string;
    title?: string;
    sources: T[];
}

export interface ISourceScrapper<
    T extends ISourceData = ISourceData,
    SO extends IScrapperOptions = IScrapperOptions> extends IScrapper<T, SO> { }

export abstract class SourceScrapper<
    T extends ISourceData = ISourceData,
    SO extends IScrapperOptions = IScrapperOptions> extends Scrapper<T, SO> implements ISourceScrapper<T, SO> { }
