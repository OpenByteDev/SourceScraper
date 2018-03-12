import axios, { AxiosResponse } from 'axios';
import HTMLStringParser from 'htmlstringparser';
import objectMerge = require('object-merge');
import { Browser, launch as puppeteerLaunch, Page } from 'puppeteer';
import typeOf = require('typeof');

import { Runner } from './Runner';
import { RunnerList } from './RunnerList';

import { config } from './config';

export const runners = new RunnerList();

export interface RunnerArgs<T extends RunnerScrapper<any>> {
    url: string;
    scrapper: T;
    options?: any;
}
export type RunnerScrapper<T extends RunnerScrapperArgs> = (args: T) => any;
export interface RunnerScrapperArgs {
    url: string;
    scrapper: RunnerScrapper<any>;
    runners: RunnerList;
}

export interface PuppeteerRunnerArgs extends RunnerArgs<PuppeteerRunnerScrapper> { }
export type PuppeteerRunnerScrapper = RunnerScrapper<PuppeteerRunnerScrapperArgs>;
export interface PuppeteerRunnerScrapperArgs extends RunnerScrapperArgs {
    browser: Browser;
    page: Page;
}
const puppeteerRunner = new Runner('puppeteer',
    async ({url, scrapper, options= {}}: PuppeteerRunnerArgs) => {
    let _options: any = {
        config: {
            headless: false
        },
        requestInterception: {
            active: true,
            block: ({ request }: { request: any, resourceType: string, url: string, page: any, browser: any }) =>
                request.resourceType === 'font'
        },
        init: null
    };
    if (options.puppeteer)
        _options = objectMerge(_options, options.puppeteer);
    _options.config = objectMerge(_options.config, config.puppeteer);

    const browser = await puppeteerLaunch(_options.config);
    const page = await browser.newPage();

    await page.emulateMedia('screen');

    await page.setRequestInterception(_options.requestInterception && _options.requestInterception.active);
    page.on('request', (request: any) => {
        const block =
            _options.requestInterception &&
            _options.requestInterception.block &&
            _options.requestInterception.block({
                request,
                resourceType: request.resourceType(),
                url: request.url(),
                page,
                browser
            });

        if (typeof block === 'undefined')
            return;
        if (block)
            request.abort();
        else request.continue();
    });

    if (typeOf(_options.init) === 'function') {
        _options.init({
            page,
            browser
        });
    }

    /* await page.evaluateOnNewDocument(async () => {
         HTMLVideoElement.prototype.canPlayType = function () { return "probably"; };
    }) ;*/
    await page.goto(url);

    try {
        return await scrapper({
            url,
            page,
            browser,
            scrapper,
            runners
        });
    } catch (e) {
        return null;
    } finally {
        await browser.close();
    }
});

export interface HTMLRunnerArgs extends RunnerArgs<HTMLRunnerScrapper> { }
export type HTMLRunnerScrapper = RunnerScrapper<HTMLRunnerScrapperArgs>;
export interface HTMLRunnerScrapperArgs extends RunnerScrapperArgs {
    response: AxiosResponse;
    html: string;
}
const htmlRunner = new Runner('html',
    async ({url, scrapper, options= {}}: HTMLRunnerArgs) => {
    let _options: any = {
        config: {url,
                 method: 'get',
                 headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'
            }
        }
    };
    if (options.axios)
        _options = objectMerge(_options, options.axios);

    const response = await axios.request(_options.config);
    return scrapper({
        url,
        html: response.data,
        response,
        scrapper,
        runners
    });
});

export function htmlToDomArgs(htmlArgs: HTMLRunnerScrapperArgs): DOMRunnerScrapperArgs {
    return {
        ...htmlArgs,
        parser: HTMLStringParser,
        dom: new HTMLStringParser(htmlArgs.html)
    };
}
export interface DOMRunnerArgs extends RunnerArgs<DOMRunnerScrapper> { }
export type DOMRunnerScrapper = RunnerScrapper<DOMRunnerScrapperArgs>;
export interface DOMRunnerScrapperArgs extends HTMLRunnerScrapperArgs {
    parser: any;
    dom: any;
}
const domRunner = new Runner('dom',
    async ({url, scrapper, options= {}}: DOMRunnerArgs) => {
    return htmlRunner.run({
        url,
        scrapper: async (args) => scrapper(htmlToDomArgs(args)),
        options
    });
});
export type UrlRunnerScrapper = (args: {
    url: string,
    scrapper: UrlRunnerScrapper,
    runners: RunnerList
}) => any;
const urlRunner = new Runner('url',
    async ({url, scrapper, options= {}}: RunnerArgs<UrlRunnerScrapper>) => {
    return scrapper({
        url,
        scrapper,
        runners
    });
});

runners.push(puppeteerRunner, htmlRunner, domRunner, urlRunner);
