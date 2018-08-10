import { IHosterData, IHosterScrapper } from './HosterScrapper';
import { IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IRunnerScrapperOptions, RunnerScrapper } from './RunnerScrapper';

export abstract class HosterRunnerScrapper<
    T extends IHosterData = IHosterData,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends Runner<T, RO, RA> = Runner<T, RO, RA>,
    SO extends IRunnerScrapperOptions<RO> = IRunnerScrapperOptions<RO>>
    extends RunnerScrapper<T, RO, RA, R, SO> implements IHosterScrapper<T, SO> { }
