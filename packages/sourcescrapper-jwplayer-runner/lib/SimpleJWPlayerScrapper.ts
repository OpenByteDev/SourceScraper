import { IJWPlayerRunnerArgs, IJWPlayerRunnerOptions, JWPlayerRunner } from './JWPlayerRunner';
import { JWPlayerSource } from './JWPlayerSource';

import {
    IRunnerScrapperOptions, ISourceData, ISourceScrapper, Scrap, SourceRunnerScrapper
} from 'sourcescrapper-core';

export class SimpleJWPlayerScrapper
    extends SourceRunnerScrapper<
        ISourceData,
        IJWPlayerRunnerOptions,
        IJWPlayerRunnerArgs,
        JWPlayerRunner<ISourceData>>
    implements ISourceScrapper {
    public static Name: string = 'jwplayer';
    public static Domains: string[] = [];
    public static UrlPattern: RegExp = /.*/i;
    public static Runner: JWPlayerRunner<ISourceData> = new JWPlayerRunner<ISourceData>();
    public static DefaultOptions: IRunnerScrapperOptions = {};
    public static async scrap(url: string): Promise<Scrap<ISourceData>> {
        return new SimpleJWPlayerScrapper().scrap(url);
    }
    public static async scrapFromArgs(args: IJWPlayerRunnerArgs): Promise<Scrap<ISourceData>> {
        return new SimpleJWPlayerScrapper().scrapFromArgs(args);
    }
    public name: string = SimpleJWPlayerScrapper.Name;
    public domains: string[] = SimpleJWPlayerScrapper.Domains;
    public urlPattern: RegExp = SimpleJWPlayerScrapper.UrlPattern;
    public runner: JWPlayerRunner<ISourceData> = SimpleJWPlayerScrapper.Runner;
    public defaultOptions: IRunnerScrapperOptions = SimpleJWPlayerScrapper.DefaultOptions;
    protected async execWithArgs({ config }: IJWPlayerRunnerArgs): Promise<ISourceData> {
        return {
            poster: config.image,
            sources: config.sources.map(s => {
                const url = s.file;
                delete s.file;
                return { ...s, url };
            }).map(s => new JWPlayerSource(s))
        };
    }
}
