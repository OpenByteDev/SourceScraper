import { IRunner, IRunnerArgs, IRunnerExec, IRunnerOptions, Runner } from './Runner';
import { IScrap, Scrap } from './Scrap';
import { IScrapper, Scrapper } from './Scrapper';
import { IStaticThis } from './types';

export interface IRunnerScrapper<
        T,
        O extends IRunnerOptions = IRunnerOptions,
        A extends IRunnerArgs<O> = IRunnerArgs<O>,
        E extends IRunnerExec<T, O, A> = IRunnerExec<T, O, A>,
        R extends IRunner<T, O, A, E> = IRunner<T, O, A, E>> extends IScrapper<T> {
    runner: R;
    runnerOptions: O;
    scrapFromArgs: (url: string, args: A) => Promise<IScrap<T>>;
}

export abstract class RunnerScrapper<
    T,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>,
    E extends IRunnerExec<T, O, A> = IRunnerExec<T, O, A>,
    R extends Runner<T, O, A, E> = Runner<T, O, A, E>> extends Scrapper<T> implements IRunnerScrapper<T, O, A, E, R> {
    public static async scrapFromArgs<
        T,
        O extends IRunnerOptions = IRunnerOptions,
        A extends IRunnerArgs<O> = IRunnerArgs<O>,
        E extends IRunnerExec<T, O, A> = IRunnerExec<T, O, A>,
        R extends IRunner<T, O, A, E> = IRunner<T, O, A, E>,
        S extends IRunnerScrapper<T, O, A, E, R> = IRunnerScrapper<T, O, A, E, R>>(
            this: IStaticThis<S>, url: string, args: A): Promise<Scrap<T>> {
        return new this().scrapFromArgs(url, args);
    }
    public abstract runner: R;
    public abstract runnerOptions: O;
    public async scrapFromArgs(url: string, args: A): Promise<Scrap<T>> {
        return this.getScrap(url, async () => this.runWithArgs(args));
    }
    protected abstract async runWithArgs(args: A): Promise<T>;
    protected async run(url: string): Promise<T> {
        return this.runner.run(url, this.runWithArgs, this.runnerOptions);
    }
}
