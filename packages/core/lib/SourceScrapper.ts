import { Scrapper } from './Scrapper';
import { Source } from './Source';

export interface SourceData<T extends Source = Source> {
    poster?: string;
    title?: string;
    sources: T[];
}
export abstract class SourceScrapper<T extends SourceData = SourceData> extends Scrapper<T> {
}
