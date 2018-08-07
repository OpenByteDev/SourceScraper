import { Hoster, HosterScrapper, IHosterData, Scrap } from 'sourcescrapper-core';
import { IPuppeteerRunnerArgs, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

import normalizeUrl = require('normalize-url');
import urlparser = require('urlparser');

export class KissanimeScrapper extends HosterScrapper<IHosterData> {
    public static Name: string = 'kissanime';
    public static Domains: string[] = ['kissanime.ru'];
    public static UrlPattern: RegExp =
        /https?:\/\/(www\.)?kissanime\.ru\/Anime\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-]+)\?id=(\d+)/i;
    public static async scrap(url: string): Promise<Scrap<IHosterData>> {
        return new KissanimeScrapper().scrap(url);
    }
    public name: string = KissanimeScrapper.Name;
    public domains: string[] = KissanimeScrapper.Domains;
    public urlPattern: RegExp = KissanimeScrapper.UrlPattern;
    protected async run(url: string): Promise<IHosterData> {
        const parsed = urlparser.parse(url);
        parsed.query.parts.push('s=rapidvideo');
        url = parsed.toString();
        return PuppeteerRunner.run(url, async ({ page }: IPuppeteerRunnerArgs) => {
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

            const waitAndGetVideoFrameSource = async (_page) => {
                await _page.waitForSelector('#divContentVideo iframe');
                return _page.$eval('#divContentVideo iframe', (frame) => frame.src);
            };
            const defaultUrl = await waitAndGetVideoFrameSource(page);

            return {
                hosters: [new Hoster({
                    name: 'rapidvideo',
                    url: defaultUrl
                })]
            };
        }, {
            requestInterceptors: [
                ({ url: u, resourceType }) =>
                    !u.includes('kissanime.ru') ||
                    resourceType === 'image' ||
                    resourceType === 'font' ||
                    resourceType === 'stylesheet'
                // ||
                // url.includes('2mdnsys.com') ||
                // url.includes('ti553.com')
            ]
        });
    }
}
