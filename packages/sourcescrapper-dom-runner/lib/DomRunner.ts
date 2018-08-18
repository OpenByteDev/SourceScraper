import { DOMWindow, FromUrlOptions, JSDOM } from 'jsdom';
import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from '../../sourcescrapper-core';

export interface IDomRunnerOptions extends IRunnerOptions {
    jsdomConfig?: FromUrlOptions;
}

export interface IDomRunnerArgs extends IRunnerArgs<IDomRunnerOptions> {
    document: Document;
    jsdom: JSDOM;
    window: DOMWindow;
}

export interface IDomRunner<T> extends IRunner<T, IDomRunnerOptions, IDomRunnerArgs> { }

export class DomRunner<T> extends Runner<T, IDomRunnerOptions, IDomRunnerArgs> implements IDomRunner<T> {
    public static DefaultOptions: IDomRunnerOptions = {
        jsdomConfig: {}
    };
    public static async run<T>(
        url: string,
        scrapper: (args: IDomRunnerArgs) => Promise<T>,
        options?: IDomRunnerOptions): Promise<T> {
        return new DomRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: IDomRunnerOptions = DomRunner.DefaultOptions;
    protected async exec(
        url: string,
        scrapper: (args: IDomRunnerArgs) => Promise<T>,
        options: IDomRunnerOptions): Promise<T> {
        const jsdom = await JSDOM.fromURL(url, options.jsdomConfig);
        return scrapper({
            url,
            options,
            jsdom,
            document: jsdom.window.document,
            window: jsdom.window
        });
    }
}
