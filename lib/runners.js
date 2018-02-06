require("./extensions.js");
const typeOf = require("typeof");

const Runner = require('./Runner.js');

const config = require('./config.js');


let runners = {};

const puppeteerRunner = new Runner('puppeteer', async (url, scrapper) => {
    const puppeteer = require('puppeteer');

    const browser = await puppeteer.launch(config.puppeteer);
    const page = await browser.newPage();

    await page.emulateMedia('screen');

    await page.setRequestInterception(true);
    page.on('request', request => {
        if (//request.resourceType === 'image' ||
            //request.resourceType === 'stylesheet' ||
            request.resourceType === 'font')
            request.abort();
        else
            request.continue();
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
const htmlRunner = new Runner('html', async (url, scrapper) => {
    const axios = require('axios');

    return await axios.get(url, {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0"
    }).then(async response => await
        scrapper({
        url: url,
        html: response.data,
        scrapper: scrapper,
        runners: runners
    }));
});
const domRunner = new Runner('dom', async (url, scrapper) => {
    const {default: HTMLStringParser} = require("htmlstringparser");

    return await htmlRunner.run(url, async ({html}) => {
        const dom = new HTMLStringParser(html);

        return await scrapper({
            url: url,
            html: html,
            parser: HTMLStringParser,
            dom: dom,
            scrapper: scrapper,
            runners: runners
        });
    });
});
const urlRunner = new Runner('url', async (url, scrapper) => {
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