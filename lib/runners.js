require("./extensions.js");
const typeOf = require("typeof");
const objectMerge = require('object-merge');

const Runner = require('./Runner.js');

const config = require('./config.js');


let runners = {};

const puppeteerRunner = new Runner('puppeteer', async ({url, scrapper, options={}}={}) => {
    const puppeteer = require('puppeteer');

    let _options = {
        config: {
            headless: false
        },
        requestInterception: {
            active: true,
            block: ({request}) => request.resourceType === 'font'
        }
    };
    if (options.puppeteer)
        _options = objectMerge(_options, options.puppeteer);
    _options.config = objectMerge(_options.config, config.puppeteer);

    const browser = await puppeteer.launch(_options.config);
    const page = await browser.newPage();

    await page.emulateMedia('screen');

    await page.setRequestInterception(_options.requestInterception.active);
    page.on('request', request => {
        const block = _options.requestInterception.block && _options.requestInterception.block({
            request: request,
            resourceType: request.resourceType(),
            url: request.url(),
            page: page,
            browser: browser,
            puppeteer: puppeteer
        });

        if (typeOf(block) === 'undefined')
            return;
        if (block)
            request.abort();
        else
            request.continue();
    });

    if (_options.init)
        _options.init({
            page: page,
            browser: browser,
            puppeteer: puppeteer
        });

    /*await page.evaluateOnNewDocument(async () => {
        HTMLVideoElement.prototype.canPlayType = function () { return "probably"; };
    });*/
    await page.goto(url);

    const ret = await scrapper({
        url: url,
        puppeteer: puppeteer,
        page: page,
        browser: browser,
        scrapper: scrapper,
        runners: runners
    }).catch();

    await browser.close();

    return ret;
});
const htmlRunner = new Runner('html', async ({url, scrapper, options={}}={}) => {
    const axios = require('axios');

    let config = {
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
const domRunner = new Runner('dom', async ({url, scrapper, options={}}={}) => {
    const { 'default': HTMLStringParser } = require("htmlstringparser");

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
const urlRunner = new Runner('url', async ({url, scrapper, options={}}={}) => {
    return await scrapper({
        url: url,
        scrapper: scrapper,
        runners: runners
    });
});

runners = {
    puppeteer: puppeteerRunner,
    html: htmlRunner,
    dom: domRunner,
    url: urlRunner
};

module.exports = runners;