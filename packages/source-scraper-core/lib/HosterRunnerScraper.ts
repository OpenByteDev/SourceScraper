import { IHosterData, IHosterScraper } from './HosterScraper';
import { IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IRunnerScraperOptions, RunnerScraper } from './RunnerScraper';

export abstract class HosterRunnerScraper<
    T extends IHosterData = IHosterData,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends Runner<T, RO, RA> = Runner<T, RO, RA>,
    SO extends IRunnerScraperOptions<RO> = IRunnerScraperOptions<RO>>
    extends RunnerScraper<T, RO, RA, R, SO> implements IHosterScraper<T, SO> { }
