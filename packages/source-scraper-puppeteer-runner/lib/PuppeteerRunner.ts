import { IRunner, IRunnerArgs, IRunnerOptions, Runner } from 'source-scraper-core';

import { Browser, launch as puppeteerLaunch, LaunchOptions, NavigationOptions, Page, Request } from 'puppeteer';

export interface IRequestInterceptorArgs {
    resourceType: string;
    url: string;
    page: Page;
    browser: Browser;
    request: Request;
}

export type IRequestInterceptor = (args: IRequestInterceptorArgs) => boolean;

export interface IInitializerArgs {
    page: Page;
    browser: Browser;
}

export type IInitializer = (args: IInitializerArgs) => void;

export interface IPuppeteerRunnerOptions extends IRunnerOptions {
    puppeteerConfig?: LaunchOptions;
    requestInterceptors?: IRequestInterceptor[];
    init?: IInitializer;
    navigationOptions?: NavigationOptions;
}

export interface IPuppeteerRunnerArgs extends IRunnerArgs<IPuppeteerRunnerOptions> {
    browser: Browser;
    page: Page;
}

export interface IPuppeteerRunner<T> extends IRunner<T, IIPuppeteerRunnerOptions, IIPuppeteerRunnerArgs> { }
export class PuppeteerRunner<T> extends Runner<T, IPuppeteerRunnerOptions, IPuppeteerRunnerArgs> {
    public defaultOptions: IPuppeteerRunnerOptions = {
        puppeteerConfig: {
            headless: true
        },
        requestInterceptors: [
            ({ resourceType }: IRequestInterceptorArgs) => resourceType === 'font'
        ]
    };

    protected async exec(
        url: string,
        scraper: (args: IPuppeteerRunnerArgs) => Promise<T>,
        options: IPuppeteerRunnerOptions): Promise<T> {
        const { puppeteerConfig, requestInterceptors, init, navigationOptions } = options;

        const browser = await puppeteerLaunch(puppeteerConfig);
        const page = await browser.newPage();

        await page.emulateMedia('screen');

        const requestInterceptionEnabled = Array.isArray(requestInterceptors) && requestInterceptors.length > 0;
        await page.setRequestInterception(requestInterceptionEnabled);
        if (requestInterceptionEnabled)
            page.on('request', (request: Request) => {
                const block = (requestInterceptors as IRequestInterceptor[]).some(e => e({
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
            return await scraper({
                url,
                browser,
                page
            });
        } finally {
            await browser.close();
        }
    }
}
