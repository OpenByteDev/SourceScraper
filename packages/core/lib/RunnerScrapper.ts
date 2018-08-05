import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IScrap, Scrap } from './Scrap';
import { IScrapper, Scrapper } from './Scrapper';

export interface IRunnerScrapper<
    T,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>,
    R extends IRunner<T, O, A> = IRunner<T, O, A>> extends IScrapper<T> {
    runner: R;
    runnerOptions?: O;
    scrapFromArgs: (args: A) => Promise<IScrap<T>>;
}

export abstract class RunnerScrapper<
    T,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>,
    R extends Runner<T, O, A> = Runner<T, O, A>> extends Scrapper<T> implements IRunnerScrapper<T, O, A, R> {
    public abstract runner: R;
    public runnerOptions?: O;
    public async scrapFromArgs(args: A): Promise<Scrap<T>> {
        return this.getScrap(args.url, async () => this.runWithArgs(args));
    }
    protected abstract async runWithArgs(args: A): Promise<T>;
    protected async run(url: string): Promise<T> {
        return this.runner.run(url, this.runWithArgs, this.runnerOptions);
    }
}
