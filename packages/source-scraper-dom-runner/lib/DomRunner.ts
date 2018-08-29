import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from 'source-scraper-core';

import { DOMWindow, FromUrlOptions, JSDOM } from 'jsdom';

export interface IDomRunnerOptions extends IRunnerOptions {
    jsdomConfig?: FromUrlOptions;
}

export interface IDomRunnerArgs extends IRunnerArgs<IDomRunnerOptions> {
    document: Document;
    jsdom: JSDOM;
    window: DOMWindow;
}

export interface IDomRunner<T> extends IRunner<T, IDomRunnerOptions, IDomRunnerArgs> { }

export class DomRunner<T> extends Runner<T, IDomRunnerOptions, IDomRunnerArgs>
    implements IDomRunner<T> {
    public defaultOptions: IDomRunnerOptions = {
        jsdomConfig: {}
    };

    protected async exec(
        url: string,
        scraper: (args: IDomRunnerArgs) => Promise<T>,
        options: IDomRunnerOptions): Promise<T> {
        const jsdom = await JSDOM.fromURL(url, options.jsdomConfig);
        return scraper({
            url,
            options,
            jsdom,
            document: jsdom.window.document,
            window: jsdom.window
        });
    }
}
