import { IHosterData, IHosterScrapper } from './HosterScrapper';
import { IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { RunnerScrapper } from './RunnerScrapper';

export abstract class HosterRunnerScrapper<
    T extends IHosterData = IHosterData,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>,
    R extends Runner<T, O, A> = Runner<T, O, A>> extends RunnerScrapper<T, O, A, R> implements IHosterScrapper { }
