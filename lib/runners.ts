import objectMerge = require('object-merge');
import typeOf = require('typeof');
import axios from 'axios';
import { Browser, Page, launch as puppeteerLaunch } from "puppeteer";
import HTMLStringParser from 'htmlstringparser';

import { Runner } from "./Runner";
import { RunnerList } from "./RunnerList";

import { config } from './config';


export const runners = new RunnerList();

export type PuppeteerRunnerScrapper = (args: { url: string, browser: Browser, page: Page, scrapper: PuppeteerRunnerScrapper, runners: RunnerList }) => any;
const puppeteerRunner = new Runner('puppeteer', async ({url, scrapper, options={}}: { url: string, scrapper: PuppeteerRunnerScrapper, options?: any }) => {
    let _options: any = {
        config: {
            headless: false
        },
        requestInterception: {
            active: true,
            block: ({ request }: { request:any, resourceType:string, url:string, page:any, browser:any }) => request.resourceType === 'font'
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
    page.on('request', (request:any) => {
        const block = _options.requestInterception && _options.requestInterception.block && _options.requestInterception.block({
            request: request,
            resourceType: request.resourceType(),
            url: request.url(),
            page: page,
            browser: browser
        });

        if (typeof block === 'undefined')
            return;
        if (block)
            request.abort();
        else
            request.continue();
    });

    if (typeOf(_options.init) === 'function')
        _options.init({
            page: page,
            browser: browser
        });

    /*await page.evaluateOnNewDocument(async () => {
        HTMLVideoElement.prototype.canPlayType = function () { return "probably"; };
    });*/
    await page.goto(url);

    try {
        return await scrapper({
            url: url,
            page: page,
            browser: browser,
            scrapper: scrapper,
            runners: runners
        });
    }
    catch(e) {
        return null;
    }
    finally {
        await browser.close();
    }
});
export type HTMLRunnerScrapper = (args: { url: string, html: string, response: any, scrapper: HTMLRunnerScrapper, runners: RunnerList }) => any;
const htmlRunner = new Runner('html', async ({url, scrapper, options={}}: { url: string, scrapper: HTMLRunnerScrapper, options?: any }) => {
    let config: any = {
        url: url,
        method: 'get',
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
        }
    };
    if (options.axios && options.axios.config)
        config = objectMerge(config, options.axios.config);

    const response = await axios.request(config);
    return await scrapper({
        url: url,
        html: response.data,
        response: response,
        scrapper: scrapper,
        runners: runners
    });
});
export type DOMRunnerScrapper = (args: { url: string, dom: any, parser: any, html: string, response: any, scrapper: DOMRunnerScrapper, runners: RunnerList }) => any;
const domRunner = new Runner('dom', async ({url, scrapper, options={}}: { url: string, scrapper: DOMRunnerScrapper, options?: any }) => {
    return await htmlRunner.run({
        url: url,
        scrapper: async (args) => {
            const dom = new HTMLStringParser(args.html);

            args.parser = HTMLStringParser;
            args.dom = dom;
            return await scrapper(args);
        },
        options: options
    });
});
export type UrlRunnerScrapper = (args: { url: string, scrapper: UrlRunnerScrapper, runners: RunnerList }) => any;
const urlRunner = new Runner('url', async ({url, scrapper, options={}}: { url: string, scrapper: UrlRunnerScrapper, options?: any }) => {
    return await scrapper({
        url: url,
        scrapper: scrapper,
        runners: runners
    });
});

runners.push(puppeteerRunner, htmlRunner, domRunner, urlRunner);