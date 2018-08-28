import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from 'source-scraper-core';

export interface I{{cp;name}}RunnerOptions extends IRunnerOptions {
}

export interface I{{cp;name}}RunnerArgs extends IRunnerArgs<I{{cp;name}}RunnerOptions> {
}

export interface I{{cp;name}}Runner<T> extends IRunner<T, I{{cp;name}}RunnerOptions, I{{cp;name}}RunnerArgs> { }

export class {{cp;name}}Runner<T> extends Runner<T, I{{cp;name}}RunnerOptions, I{{cp;name}}RunnerArgs> implements I{{cp;name}}Runner<T> {
    public defaultOptions: I{{cp;name}}RunnerOptions = {};

    protected async exec(
        url: string,
        scraper: (args: I{{cp;name}}RunnerArgs) => Promise<T>,
        options: I{{cp;name}}RunnerOptions): Promise<T> {
        return scraper({
            url,
            options
        });
    }
}
