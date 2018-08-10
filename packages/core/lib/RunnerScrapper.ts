import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IScrap, Scrap } from './Scrap';
import { IScrapper, IScrapperOptions, Scrapper } from './Scrapper';

export interface IRunnerScrapperOptions<RO extends IRunnerOptions = IRunnerOptions> extends IScrapperOptions {
    runnerOptions?: RO;
}

export interface IRunnerScrapper<
    T,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends IRunner<T, RO, RA> = IRunner<T, RO, RA>,
    SO extends IRunnerScrapperOptions<RO> = IRunnerScrapperOptions<RO>> extends IScrapper<T, SO> {
    runner: R;
    scrapFromArgs: (args: RA, options?: SO) => Promise<IScrap<T>>;
}

export abstract class RunnerScrapper<
    T,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends Runner<T, RO, RA> = Runner<T, RO, RA>,
    SO extends IRunnerScrapperOptions<RO> = IRunnerScrapperOptions<RO>>
    extends Scrapper<T, SO> implements IRunnerScrapper<T, RO, RA, R, SO> {
    public abstract runner: R;
    public async scrapFromArgs(args: RA, options?: SO): Promise<Scrap<T>> {
        return this.getScrap(args.url, async () => this.execWithArgs(args, this.getOptions(options)));
    }
    protected abstract async execWithArgs(args: RA, options?: SO): Promise<T>;
    protected async exec(url: string, options?: SO): Promise<T> {
        const so = this.getOptions(options);
        const ro = this.runner.getOptions(so.runnerOptions);
        return this.runner.run(url, async (args: RA) => this.execWithArgs(args, so), ro);
    }
}
