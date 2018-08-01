import { IStaticThis } from './types';

import objectMerge = require('object-merge');

export type IRunnerOptions = object;

export interface IRunnerArgs<O extends IRunnerOptions = IRunnerOptions> {
    url: string;
    options?: O;
}

export type IRunnerExec<T, O extends IRunnerOptions, A extends IRunnerArgs<O>> = (args: A) => Promise<T>;

export interface IRunner<
        T,
        O extends IRunnerOptions = IRunnerOptions,
        A extends IRunnerArgs<O> = IRunnerArgs<O>,
        E extends IRunnerExec<T, O, A> = IRunnerExec<T, O, A>> {
    run: (url: string, scrapper: E , options?: O) => Promise<T>;
}

export abstract class Runner<
        T,
        O extends IRunnerOptions = IRunnerOptions,
        A extends IRunnerArgs<O> = IRunnerArgs<O>,
        E extends IRunnerExec<T, O, A> = IRunnerExec<T, O, A>> implements IRunner<T, O, A, E> {
    public static async run<
        T,
        O extends IRunnerOptions = IRunnerOptions,
        A extends IRunnerArgs<O> = IRunnerArgs<O>,
        E extends IRunnerExec<T, O, A> = IRunnerExec<T, O, A>,
        R extends IRunner<T, O, A, E> = IRunner<T, O, A, E>>(
            this: IStaticThis<R>, url: string, scrapper: E, options?: O): Promise<T> {
        return new this().run(url, scrapper, options);
    }
    public abstract defaultOptions: O;
    public abstract async run(url: string, scrapper: (args: A) => Promise<T>, options?: O): Promise<T>;
    protected getOptions(options?: O): O {
        return typeof options === 'undefined' ?
            this.defaultOptions :
            objectMerge(this.defaultOptions, options) as O;
    }
}
