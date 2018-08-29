import { FlowplayerRunner, IFlowplayerRunnerArgs, IFlowplayerRunnerOptions } from './FlowplayerRunner';
import { FlowplayerSource } from './FlowplayerSource';

import { IRunnerScraperOptions, ISourceData, ISourceScraper, SourceRunnerScraper } from 'source-scraper-core';

export type ISimpleFlowplayerScraperOptions = IRunnerScraperOptions<IFlowplayerRunnerOptions>;

export type ISimpleFlowplayerScraperSourceData = ISourceData<FlowplayerSource>;

export class SimpleFlowplayerScraper
    extends SourceRunnerScraper<
        ISimpleFlowplayerScraperSourceData,
        IFlowplayerRunnerOptions,
        IFlowplayerRunnerArgs,
        FlowplayerRunner<ISimpleFlowplayerScraperSourceData>>
    implements ISourceScraper {

    public name: string = 'flowplayer';
    public domains: string[] = [];
    public urlPattern: RegExp = /.*/i;
    public runner: FlowplayerRunner<ISimpleFlowplayerScraperSourceData> =
        new FlowplayerRunner<ISimpleFlowplayerScraperSourceData>();
    public defaultOptions: ISimpleFlowplayerScraperOptions = {};

    protected async execWithArgs({ sources }: IFlowplayerRunnerArgs): Promise<ISimpleFlowplayerScraperSourceData> {
        return {
            sources: sources.map(s => {
                const url = s.src;
                delete s.src;
                return { ...s, url };
            }).map(s => new FlowplayerSource(s))
        };
    }
}
