import { FlowplayerRunner, IFlowplayerRunnerArgs, IFlowplayerRunnerOptions } from './FlowplayerRunner';
import { FlowplayerSource } from './FlowplayerSource';

import {
    IRunnerScrapperOptions, ISourceData, ISourceScrapper, Scrap, SourceRunnerScrapper
} from 'sourcescrapper-core';

export type ISimpleFlowplayerScrapperOptions = IRunnerScrapperOptions<IFlowplayerRunnerOptions>;

export type IFlowplayerSourceData = ISourceData<FlowplayerSource>;

export class SimpleFlowplayerScrapper
    extends SourceRunnerScrapper<
        IFlowplayerSourceData,
        IFlowplayerRunnerOptions,
        IFlowplayerRunnerArgs,
        FlowplayerRunner<IFlowplayerSourceData>>
    implements ISourceScrapper<IFlowplayerSourceData> {
    public static Name: string = 'flowplayer';
    public static Domains: string[] = [];
    public static UrlPattern: RegExp = /.*/i;
    public static Runner: FlowplayerRunner<IFlowplayerSourceData> = new FlowplayerRunner<IFlowplayerSourceData>();
    public static DefaultOptions: ISimpleFlowplayerScrapperOptions = {};
    public static async scrap(url: string): Promise<Scrap<IFlowplayerSourceData>> {
        return new SimpleFlowplayerScrapper().scrap(url);
    }
    public static async scrapFromArgs(args: IFlowplayerRunnerArgs): Promise<Scrap<IFlowplayerSourceData>> {
        return new SimpleFlowplayerScrapper().scrapFromArgs(args);
    }
    public name: string = SimpleFlowplayerScrapper.Name;
    public domains: string[] = SimpleFlowplayerScrapper.Domains;
    public urlPattern: RegExp = SimpleFlowplayerScrapper.UrlPattern;
    public runner: FlowplayerRunner<IFlowplayerSourceData> = SimpleFlowplayerScrapper.Runner;
    public defaultOptions: ISimpleFlowplayerScrapperOptions = SimpleFlowplayerScrapper.DefaultOptions;
    protected async execWithArgs({ sources }: IFlowplayerRunnerArgs): Promise<IFlowplayerSourceData> {
        return {
            sources: sources.map(s => {
                const url = s.src;
                delete s.src;
                return { ...s, url };
            }).map(s => new FlowplayerSource(s))
        };
    }
}
