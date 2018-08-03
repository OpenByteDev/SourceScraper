import { IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { RunnerScrapper } from './RunnerScrapper';
import { ISourceData, ISourceScrapper } from './SourceScrapper';

export abstract class SourceRunnerScrapper<
    T extends ISourceData = ISourceData,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>,
    R extends Runner<T, O, A> = Runner<T, O, A>> extends RunnerScrapper<T, O, A, R> implements ISourceScrapper { }
