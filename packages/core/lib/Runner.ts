import objectMerge = require('object-merge');

export type IRunnerOptions = object;

export interface IRunnerArgs<O extends IRunnerOptions = IRunnerOptions> {
    url: string;
    options?: O;
}

export interface IRunner<
    T,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>> {
    run: (url: string, scrapper: (args: A) => Promise<T> , options?: O) => Promise<T>;
}

export abstract class Runner<
    T,
    O extends IRunnerOptions = IRunnerOptions,
    A extends IRunnerArgs<O> = IRunnerArgs<O>> implements IRunner<T, O, A> {
    /*public static async run<
        T,
        O extends IRunnerOptions = IRunnerOptions,
        A extends IRunnerArgs<O> = IRunnerArgs<O>>(
        this: IStaticThis<Runner<T, O, A>>, url: string, scrapper: (args: A) => Promise<T>, options?: O): Promise<T> {
        return new this().run(url, scrapper, options);
    }*/
    public abstract defaultOptions: O;
    public abstract async run(url: string, scrapper: (args: A) => Promise<T>, options?: O): Promise<T>;
    protected getOptions(options?: O): O {
        return typeof options === 'undefined' ?
            this.defaultOptions :
            objectMerge(this.defaultOptions, options) as O;
    }
}
