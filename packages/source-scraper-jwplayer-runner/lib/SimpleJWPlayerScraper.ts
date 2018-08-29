import { IJWPlayerRunnerArgs, IJWPlayerRunnerOptions, JWPlayerRunner } from './JWPlayerRunner';
import { JWPlayerSource } from './JWPlayerSource';

import {
    IRunnerScraperOptions, ISourceData, ISourceScraper, SourceRunnerScraper
} from 'source-scraper-core';

export type ISimpleJWPlayerScraperOptions = IRunnerScraperOptions<IJWPlayerRunnerOptions>;

export type ISimpleJWPlayerScraperSourceData = ISourceData<JWPlayerSource>;

export class SimpleJWPlayerScraper
    extends SourceRunnerScraper<
        ISimpleJWPlayerScraperSourceData,
        IJWPlayerRunnerOptions,
        IJWPlayerRunnerArgs,
        JWPlayerRunner<ISimpleJWPlayerScraperSourceData>>
    implements ISourceScraper {

    public name: string = 'jwplayer';
    public domains: string[] = [];
    public urlPattern: RegExp = /.*/i;
    public runner: JWPlayerRunner<ISimpleJWPlayerScraperSourceData> =
        new JWPlayerRunner<ISimpleJWPlayerScraperSourceData>();
    public defaultOptions: ISimpleJWPlayerScraperOptions = {};

    protected async execWithArgs({ sources, poster }: IJWPlayerRunnerArgs): Promise<ISimpleJWPlayerScraperSourceData> {
        return {
            poster,
            sources: sources.map(s => {
                const url = s.file;
                delete s.file;
                return { ...s, url };
            }).map(s => new JWPlayerSource(s))
        };
    }
}
