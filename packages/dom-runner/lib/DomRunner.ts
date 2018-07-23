import { DOMWindow, FromUrlOptions, JSDOM } from 'jsdom';
import { Runner, RunnerArgs, RunnerOptions } from 'sourcescrapper-core';

export interface DomRunnerOptions extends RunnerOptions {
    jsdomConfig?: FromUrlOptions;
}
export interface DomRunnerArgs<T> extends RunnerArgs<T> {
    document: Document;
    jsdom: JSDOM;
    window: DOMWindow;
}
export type DomRunnerExec<T> = (DomRunnerArgs) => Promise<T>;
export class DomRunner<T> extends Runner<T, DomRunnerExec<T>, DomRunnerOptions> {
    public static async run<T>(url: string, scrapper: DomRunnerExec<T>, options?: DomRunnerOptions): Promise<T> {
        return new DomRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: DomRunnerOptions = {
        jsdomConfig: {}
    };
    public async run(url: string, scrapper: DomRunnerExec<T>, options?: DomRunnerOptions): Promise<T> {
        const opt = this.getOptions(options);
        const jsdom = await JSDOM.fromURL(url, opt.jsdomConfig);
        return scrapper({
            jsdom,
            document: jsdom.window.document,
            window: jsdom.window
        });
    }
}
