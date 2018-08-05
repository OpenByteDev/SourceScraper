import { Hoster, HosterRunnerScrapper, IHosterData, Scrap } from 'sourcescrapper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

import normalizeUrl = require('normalize-url');
import random = require('random-number');
import urlparser = require('urlparser');

export class KissanimeScrapper extends HosterRunnerScrapper<IHosterData> {
    public static Name: string = 'kissanime';
    public static Domains: string[] = ['kissanime.ru'];
    public static UrlPattern: RegExp =
        /https?:\/\/(www\.)?kissanime\.ru\/Anime\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-]+)\?id=(\d+)/i;
    public static Runner: PuppeteerRunner<IHosterData> = new PuppeteerRunner<IHosterData>();
    public static RunnerOptions: IPuppeteerRunnerOptions = {
        puppeteerConfig: {
            headless: false
        },
        requestInterceptors: [
            ({ url, resourceType }) =>
                !url.includes('kissanime.ru') ||
                resourceType === 'image' ||
                resourceType === 'font' ||
                resourceType === 'stylesheet'
            // ||
            // url.includes('2mdnsys.com') ||
            // url.includes('ti553.com')
        ]
    };
    public static async scrap(url: string): Promise<Scrap<IHosterData>> {
        return new KissanimeScrapper().scrap(url);
    }
    public static async scrapFromArgs(args: IPuppeteerRunnerArgs): Promise<Scrap<IHosterData>> {
        return new KissanimeScrapper().scrapFromArgs(args);
    }
    public name: string = KissanimeScrapper.Name;
    public domains: string[] = KissanimeScrapper.Domains;
    public urlPattern: RegExp = KissanimeScrapper.UrlPattern;
    public runner: PuppeteerRunner<IHosterData> = KissanimeScrapper.Runner;
    public runnerOptions: IPuppeteerRunnerOptions = KissanimeScrapper.RunnerOptions;
    protected async runWithArgs({ page, url }: IPuppeteerRunnerArgs): Promise<IHosterData> {
        const gotoIfNotTarget = async (_page) => {
            if (normalizeUrl(_page.url()) !== normalizeUrl(url)) {
                await _page.goto(url, {
                    waitUntil: 'domcontentloaded'
                });
            }
        };
        await page.waitForNavigation({
            waitUntil: 'domcontentloaded'
        });
        await gotoIfNotTarget(page);
        // await page.waitForSelector('#formVerify img');

        while (page.url().toLowerCase().includes('special/areyouhuman2?reurl')) {
            const verifyOptions = await page.$$('#formVerify img');
            const r = random.generator({
                min: 0,
                max: verifyOptions.length - 1,
                integer: true
            });
            const r1 = r();
            let r2;
            do { r2 = r(); }
            while (r1 === r2);

            await verifyOptions[r1].click();
            await verifyOptions[r2].click();

            const response = await page.waitForNavigation({
                waitUntil: 'domcontentloaded'
            });

            if (response.status() === 500)
                await page.goto(url, {
                    waitUntil: 'domcontentloaded'
                });

            if (page.url().toLowerCase().includes('special/areyouhuman2')) {
                const responseText = await page.$eval('body', body => body.textContent);
                if (!responseText)
                    return Promise.reject(null);
                const link = await page.$('a');
                if (!link)
                    return Promise.reject(null);
                await link.click();
                await page.waitForSelector('#formVerify img');
            }
        }
        await gotoIfNotTarget(page);

        const waitAndGetVideoFrameSource = async (_page) => {
            await _page.waitForSelector('#divContentVideo iframe');
            return _page.$eval('#divContentVideo iframe', (frame) => frame.src);
        };
        const defaultUrl = await waitAndGetVideoFrameSource(page);

        const hosterOptionsHandles = await page.$$('#selectServer option');
        const hosterOptions: Array<{ name: string, url: string, default: boolean }> = [];

        for (const hosterHandle of hosterOptionsHandles)
            hosterOptions.push({
                name: await (await hosterHandle.getProperty('innerText')).jsonValue(),
                url: await (await hosterHandle.getProperty('value')).jsonValue(),
                default: await (await hosterHandle.getProperty('selected')).jsonValue()
            });

        const hosters: Hoster[] = [];
        const u = urlparser.parse(url);
        const baseUrl = `${u.host.protocol}://${u.host.hostname}`;
        for (const hoster of hosterOptions) {
            if (hoster.name.toLowerCase() === 'beta server')
                continue;
            if (hoster.default) {
                hosters.push(new Hoster({
                    name: hoster.name,
                    url: defaultUrl
                }));
                continue;
            }
            await page.goto(baseUrl + hoster.url, {
                waitUntil: 'domcontentloaded'
            });
            hosters.push(new Hoster({
                name: hoster.name,
                url: await waitAndGetVideoFrameSource(page)
            }));
        }

        return {
            hosters
        };
    }
}
