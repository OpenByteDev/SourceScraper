import { IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IRunnerScrapperOptions, RunnerScrapper } from './RunnerScrapper';
import { ISourceData, ISourceScrapper } from './SourceScrapper';

export abstract class SourceRunnerScrapper<
    T extends ISourceData = ISourceData,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends Runner<T, RO, RA> = Runner<T, RO, RA>,
    SO extends IRunnerScrapperOptions<RO> = IRunnerScrapperOptions<RO>>
    extends RunnerScrapper<T, RO, RA, R, SO> implements ISourceScrapper<T, SO> { }
