import { IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IRunnerScraperOptions, RunnerScraper } from './RunnerScraper';
import { ISourceData, ISourceScraper } from './SourceScraper';

export abstract class SourceRunnerScraper<
    T extends ISourceData = ISourceData,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends Runner<T, RO, RA> = Runner<T, RO, RA>,
    SO extends IRunnerScraperOptions<RO> = IRunnerScraperOptions<RO>>
    extends RunnerScraper<T, RO, RA, R, SO> implements ISourceScraper<T, SO> { }
