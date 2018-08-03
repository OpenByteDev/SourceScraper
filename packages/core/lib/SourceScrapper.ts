import { IScrapper, Scrapper } from './Scrapper';
import { ISource, Source } from './Source';

export interface ISourceData<T extends ISource = Source> {
    poster?: string;
    title?: string;
    sources: T[];
}

export interface ISourceScrapper<T extends ISourceData = ISourceData> extends IScrapper<T> { }

export abstract class SourceScrapper<T extends ISourceData = ISourceData>
    extends Scrapper<T> implements ISourceScrapper<T> { }
