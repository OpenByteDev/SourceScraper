import { Runner, RunnerArgs, RunnerOptions } from 'sourcescrapper-core';

export type UrlRunnerOptions = RunnerOptions;
export type UrlRunnerArgs<T> = RunnerArgs<T>;
export type UrlRunnerExec<T> = (UrlRunnerArgs) => Promise<T>;
export class UrlRunner<T> extends Runner<T, UrlRunnerExec<T>, UrlRunnerOptions> {
    public static async run<T>(url: string, scrapper: UrlRunnerExec<T>, options?: UrlRunnerOptions): Promise<T> {
        return new UrlRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: UrlRunnerOptions = {};
    public async run(url: string, scrapper: UrlRunnerExec<T>, options?: UrlRunnerOptions): Promise<T> {
        return scrapper({
            options,
            scrapper,
            url
        });
    }
}
