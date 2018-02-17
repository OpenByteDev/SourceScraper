import axios from 'axios';
import HTMLStringParser from 'htmlstringparser';
import objectMerge = require('object-merge');
import { Browser, launch as puppeteerLaunch, Page } from 'puppeteer';
import typeOf = require('typeof');

import { Runner } from './Runner';
import { RunnerList } from './RunnerList';

import { config } from './config';

export const runners = new RunnerList();

declare interface RunnerArgs<RunnerScrapper> {
    url: string;
    scrapper: RunnerScrapper;
    options?: any;
}

export type PuppeteerRunnerScrapper = (args: {
    url: string,
    browser: Browser,
    page: Page,
    scrapper: PuppeteerRunnerScrapper,
    runners: RunnerList
}) => any;
const puppeteerRunner = new Runner('puppeteer',
    async ({url, scrapper, options= {}}: RunnerArgs<PuppeteerRunnerScrapper>) => {
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
    if (options.puppeteer) {
        _options = objectMerge(_options, options.puppeteer);
    }
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

        if (typeof block === 'undefined') {
            return;
        }
        if (block) {
            request.abort();
        } else {
            request.continue();
        }
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
export type HTMLRunnerScrapper = (args: {
    url: string,
    html: string,
    response: any,
    scrapper: HTMLRunnerScrapper,
    runners: RunnerList
}) => any;
const htmlRunner = new Runner('html',
    async ({url, scrapper, options= {}}: RunnerArgs<HTMLRunnerScrapper>) => {
    let _options: any = {
        config: {url,
                 method: 'get',
                 headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'
            }
        }
    };
    if (options.axios) {
        _options = objectMerge(_options, options.axios);
    }

    const response = await axios.request(_options.config);
    return scrapper({
        url,
        html: response.data,
        response,
        scrapper,
        runners
    });
});
export type DOMRunnerScrapper = (args: {
    url: string,
    dom: any,
    parser: any,
    html: string,
    response: any,
    scrapper: DOMRunnerScrapper,
    runners: RunnerList
}) => any;
const domRunner = new Runner('dom',
    async ({url, scrapper, options= {}}: RunnerArgs<DOMRunnerScrapper>) => {
    return htmlRunner.run({
        url,
        scrapper: async (args) => {
            const dom = new HTMLStringParser(args.html);

            args.parser = HTMLStringParser;
            args.dom = dom;
            return scrapper(args);
        },
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
