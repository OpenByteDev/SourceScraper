import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { IRunnerArgs, IRunnerOptions, Runner } from 'sourcescrapper-core';

export interface IHtmlRunnerOptions extends IRunnerOptions {
    axiosConfig: AxiosRequestConfig;
}

export interface IHtmlRunnerArgs extends IRunnerArgs<IHtmlRunnerOptions> {
    html: string;
    response: AxiosResponse;
}

export class HtmlRunner<T> extends Runner<T, IHtmlRunnerOptions, IHtmlRunnerArgs> {
    public static DefaultOptions: IHtmlRunnerOptions = {
        axiosConfig: {}
    };
    public defaultOptions: IHtmlRunnerOptions = HtmlRunner.DefaultOptions;
    public async run(
        url: string,
        scrapper: (args: IHtmlRunnerArgs) => Promise<T>,
        options?: IHtmlRunnerOptions): Promise<T> {
        const opt = this.getOptions(options);
        const response = await axios.get(url, opt.axiosConfig);
        return scrapper({
            url,
            options,
            response,
            html: response.data
        });
    }
}
