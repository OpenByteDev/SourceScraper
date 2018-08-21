import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from 'sourcescrapper-core';

export interface IHtmlRunnerOptions extends IRunnerOptions {
    axiosConfig: AxiosRequestConfig;
}

export interface IHtmlRunnerArgs extends IRunnerArgs<IHtmlRunnerOptions> {
    html: string;
    response: AxiosResponse;
}

export interface IHtmlRunner<T> extends IRunner<T, IHtmlRunnerOptions, IHtmlRunnerArgs> { }

export class HtmlRunner<T> extends Runner<T, IHtmlRunnerOptions, IHtmlRunnerArgs> implements IHtmlRunner<T> {
    public static DefaultOptions: IHtmlRunnerOptions = {
        axiosConfig: {}
    };
    public static async run<T>(
        url: string,
        scrapper: (args: IHtmlRunnerArgs) => Promise<T>,
        options?: IHtmlRunnerOptions): Promise<T> {
        return new HtmlRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: IHtmlRunnerOptions = HtmlRunner.DefaultOptions;
    protected async exec(
        url: string,
        scrapper: (args: IHtmlRunnerArgs) => Promise<T>,
        options: IHtmlRunnerOptions): Promise<T> {
        const response = await axios.get(url, options.axiosConfig);
        return scrapper({
            url,
            options,
            response,
            html: response.data
        });
    }
}
