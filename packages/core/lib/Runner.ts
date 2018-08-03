import { IStaticThis } from './types';

import objectMerge = require('object-merge');

export type IRunnerOptions = object;

export interface IRunnerArgs<T> {
    url: string;
    scrapper: IRunnerExec<T>;
    options?: IRunnerOptions;
}

export type IRunnerExec<T> = (args: IRunnerArgs<T>) => Promise<T>;

export interface IRunner<
        T,
        E extends IRunnerExec<T> = IRunnerExec<T>,
        O extends IRunnerOptions = IRunnerOptions> {
    run: (url: string, scrapper: E, options?: O) => Promise<T>;
}

export abstract class Runner<
        T,
        E extends IRunnerExec<T> = IRunnerExec<T>,
        O extends IRunnerOptions = IRunnerOptions> implements IRunner<T, E, O> {
    public static async run<
            T,
            E extends IRunnerExec<T> = IRunnerExec<T>,
            O extends IRunnerOptions = IRunnerOptions>(
                this: IStaticThis<IRunner<T, E, O>>, url: string, scrapper: E, options?: O): Promise<T> {
        return new this().run(url, scrapper, options);
    }
    public abstract defaultOptions: O;
    public abstract async run(url: string, scrapper: E, options?: O): Promise<T>;
    protected getOptions(options?: O): O {
        return typeof options === 'undefined' ?
            this.defaultOptions :
            objectMerge(this.defaultOptions, options) as O;
    }
}
