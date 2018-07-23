import { Runner, RunnerArgs, RunnerOptions } from 'sourcescrapper-core';

import { Browser, launch as puppeteerLaunch, LaunchOptions, NavigationOptions, Page, Request } from 'puppeteer';

export interface PuppeteerRunnerArgs<T> extends RunnerArgs<T> {
    browser: Browser;
    page: Page;
}
export type PuppeteerRunnerExec<T> = (PuppeteerRunnerArgs) => Promise<T>;
export interface PuppeteerRunnerOptions extends RunnerOptions {
    puppeteerConfig?: LaunchOptions;
    requestInterceptors?: RequestInterceptor[];
    init?: Initializer;
    navigationOptions?: NavigationOptions;
}
export type RequestInterceptor = (RequestInterceptorArgs) => boolean;
export interface RequestInterceptorArgs {
    resourceType: string;
    url: string;
    page: Page;
    browser: Browser;
}
export type Initializer = (InitializerArgs) => void;
export interface InitializerArgs {
    page: Page;
    browser: Browser;
}
export class PuppeteerRunner<T> extends Runner<T, PuppeteerRunnerExec<T>, PuppeteerRunnerOptions> {
    // tslint:disable-next-line
    public static async run<T>(url: string, scrapper: PuppeteerRunnerExec<T>, options?: PuppeteerRunnerOptions): Promise<T> {
        return new PuppeteerRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: PuppeteerRunnerOptions = {
        puppeteerConfig: {
            headless: false
        },
        requestInterceptors: [
            ({ request }) => request.resourceType === 'font'
        ]
    };
    public async run(url: string, scrapper: PuppeteerRunnerExec<T>, options?: PuppeteerRunnerOptions): Promise<T> {
        const { puppeteerConfig, requestInterceptors, init, navigationOptions } = this.getOptions(options);

        const browser = await puppeteerLaunch(puppeteerConfig);
        const page = await browser.newPage();

        await page.emulateMedia('screen');

        const requestInterceptionEnabled = Array.isArray(requestInterceptors) && requestInterceptors.length > 0;
        await page.setRequestInterception(requestInterceptionEnabled);
        if (requestInterceptionEnabled)
            page.on('request', (request: Request) => {
                const block = (requestInterceptors as RequestInterceptor[]).some(e => e({
                    browser,
                    page,
                    request,
                    resourceType: request.resourceType(),
                    url: request.url()
                }));
                if (block)
                    request.abort();
                else request.continue();
            });

        if (typeof init !== 'undefined')
            init({
                browser,
                page
            });

        /* await page.evaluateOnNewDocument(async () => {
             HTMLVideoElement.prototype.canPlayType = function () { return "probably"; };
        }) ;*/
        await page.goto(url, navigationOptions);

        try {
            return await scrapper({
                browser,
                page,
                url
            });
        } finally {
            await browser.close();
        }
    }
}
