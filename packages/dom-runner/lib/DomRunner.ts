import { DOMWindow, FromUrlOptions, JSDOM } from 'jsdom';
import { IRunner, IRunnerArgs, IRunnerExec, IRunnerOptions, Runner } from 'sourcescrapper-core';

export interface IDomRunnerOptions extends IRunnerOptions {
    jsdomConfig?: FromUrlOptions;
}

export interface IDomRunnerArgs extends IRunnerArgs<IDomRunnerOptions> {
    document: Document;
    jsdom: JSDOM;
    window: DOMWindow;
}

export interface IDomRunnerExec<T> extends IRunnerExec<T, IDomRunnerOptions, IDomRunnerArgs> {
    (args: IDomRunnerArgs): Promise<T>;
}

export interface IDomRunner<T> extends IRunner<T, IDomRunnerOptions, IDomRunnerArgs, IDomRunnerExec<T>> { }

export class DomRunner<T> extends Runner<T, IDomRunnerOptions, IDomRunnerArgs, IDomRunnerExec<T>>
    implements IDomRunner<T> {
    public static DefaultOptions: IDomRunnerOptions = {
        jsdomConfig: {}
    };
    public defaultOptions: IDomRunnerOptions = DomRunner.DefaultOptions;
    public constructor() {
        super();
    }
    public async run(url: string, scrapper: IDomRunnerExec<T>, options?: IDomRunnerOptions): Promise<T> {
        const opt = this.getOptions(options);
        const jsdom = await JSDOM.fromURL(url, opt.jsdomConfig);
        return scrapper({
            url,
            options,
            jsdom,
            document: jsdom.window.document,
            window: jsdom.window
        });
    }
}
