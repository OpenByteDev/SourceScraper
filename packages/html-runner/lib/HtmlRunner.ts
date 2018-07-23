import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Runner, RunnerArgs, RunnerOptions } from 'sourcescrapper-core';

export interface HtmlRunnerOptions extends RunnerOptions {
    axiosConfig: AxiosRequestConfig;
}
export interface HtmlRunnerArgs<T> extends RunnerArgs<T> {
    html: string;
    response: AxiosResponse;
}
export type HtmlRunnerExec<T> = (HtmlRunnerArgs) => Promise<T>;
export class HtmlRunner<T> extends Runner<T, HtmlRunnerExec<T>, HtmlRunnerOptions> {
    public static async run<T>(url: string, scrapper: HtmlRunnerExec<T>, options?: HtmlRunnerOptions): Promise<T> {
        return new HtmlRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: HtmlRunnerOptions = {
        axiosConfig: {}
    };
    public async run(url: string, scrapper: HtmlRunnerExec<T>, options?: HtmlRunnerOptions): Promise<T> {
        const opt = this.getOptions(options);
        const response = await axios.get(url, opt.axiosConfig);
        return scrapper({
            options,
            response,
            scrapper,
            url,
        });
    }
}
