import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from './Runner';
import { IScrap, Scrap } from './Scrap';
import { IScraper, IScraperOptions, Scraper } from './Scraper';

export interface IRunnerScraperOptions<RO extends IRunnerOptions = IRunnerOptions> extends IScraperOptions {
    runnerOptions?: RO;
}

export interface IRunnerScraper<
    T,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends IRunner<T, RO, RA> = IRunner<T, RO, RA>,
    SO extends IRunnerScraperOptions<RO> = IRunnerScraperOptions<RO>> extends IScraper<T, SO> {
    runner: R;
    scrapFromArgs: (args: RA, options?: SO) => Promise<IScrap<T>>;
}

export abstract class RunnerScraper<
    T,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>,
    R extends Runner<T, RO, RA> = Runner<T, RO, RA>,
    SO extends IRunnerScraperOptions<RO> = IRunnerScraperOptions<RO>>
    extends Scraper<T, SO> implements IRunnerScraper<T, RO, RA, R, SO> {
    public abstract runner: R;
    public async scrapFromArgs(args: RA, options?: SO): Promise<Scrap<T>> {
        return this.getScrap(args.url, async () => this.execWithArgs(args, this.getOptions(options)));
    }
    protected abstract async execWithArgs(args: RA, options: SO): Promise<T>;
    protected async exec(url: string, options: SO): Promise<T> {
        return this.runner.run(
            url,
            async (args: RA) => this.execWithArgs(args, options),
            options.runnerOptions);
    }
}
