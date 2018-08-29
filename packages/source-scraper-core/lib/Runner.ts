import { Configurable, IConfigurable, IOptions } from './Configurable';

export type IRunnerOptions = IOptions;

export interface IRunnerArgs<RO extends IRunnerOptions = IRunnerOptions> {
    url: string;
    options?: RO;
}

export interface IRunner<
    T,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>> extends IConfigurable<RO> {
    run: (url: string, scraper: (args: RA) => Promise<T> , options?: RO) => Promise<T>;
}

export abstract class Runner<
    T,
    RO extends IRunnerOptions = IRunnerOptions,
    RA extends IRunnerArgs<RO> = IRunnerArgs<RO>> extends Configurable<RO> implements IRunner<T, RO, RA> {
    public async run(url: string, scraper: (args: RA) => Promise<T>, options?: RO): Promise<T> {
        return this.exec(url, scraper, this.getOptions(options));
    }
    protected abstract async exec(url: string, scraper: (args: RA) => Promise<T>, options: RO): Promise<T>;
}
