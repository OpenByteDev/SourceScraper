import { Scrapper } from './Scrapper';
import { Source } from './Source';

export interface SourceData {
    poster?: string;
    title?: string;
    sources: Source[];
}
export abstract class SourceScrapper extends Scrapper<SourceData> {
    public abstract run(url: string): Promise<SourceData>;
}
