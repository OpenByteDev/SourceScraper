import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from 'source-scraper-core';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IHtmlRunnerOptions extends IRunnerOptions {
    axiosConfig: AxiosRequestConfig;
}

export interface IHtmlRunnerArgs extends IRunnerArgs<IHtmlRunnerOptions> {
    html: string;
    response: AxiosResponse;
}

export interface IHtmlRunner<T> extends IRunner<T, IHtmlRunnerOptions, IHtmlRunnerArgs> { }

export class HtmlRunner<T> extends Runner<T, IHtmlRunnerOptions, IHtmlRunnerArgs>
    implements IHtmlRunner<T> {
    public defaultOptions: IHtmlRunnerOptions = {
        axiosConfig: {}
    };

    protected async exec(
        url: string,
        scraper: (args: IHtmlRunnerArgs) => Promise<T>,
        options: IHtmlRunnerOptions): Promise<T> {
        const response = await axios.get(url, options.axiosConfig);
        return scraper({
            url,
            options,
            response,
            html: response.data
        });
    }
}
