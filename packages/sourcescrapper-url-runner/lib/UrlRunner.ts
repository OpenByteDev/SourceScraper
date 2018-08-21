import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from 'sourcescrapper-core';

export type IUrlRunnerOptions = IRunnerOptions;

export type IUrlRunnerArgs = IRunnerArgs<IUrlRunnerOptions>;

export interface IUrlRunner<T> extends IRunner<T, IUrlRunnerOptions, IUrlRunnerArgs> { }

export class UrlRunner<T> extends Runner<T, IUrlRunnerOptions, IUrlRunnerArgs> implements IUrlRunner<T> {
    public static DefaultOptions: IUrlRunnerOptions = { };
    public static async run<T>(
        url: string,
        scrapper: (args: IUrlRunnerArgs) => Promise<T>,
        options?: IUrlRunnerOptions): Promise<T> {
        return new UrlRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: IUrlRunnerOptions = UrlRunner.DefaultOptions;
    public async exec(
        url: string,
        scrapper: (args: IUrlRunnerArgs) => Promise<T>,
        options: IUrlRunnerOptions): Promise<T> {
        return scrapper({
            options,
            url
        });
    }
}
