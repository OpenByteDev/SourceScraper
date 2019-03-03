import { Hoster, HosterScraper, IHosterData, IRunnerScraperOptions } from 'source-scraper-core';
import { IPuppeteerRunnerOptions, PuppeteerRunner } from 'source-scraper-puppeteer-runner';

import normalizeUrl from 'normalize-url';
import urlparser = require('urlparser');

export type IKissanimeScraperOptions = IRunnerScraperOptions<IPuppeteerRunnerOptions>;

export type IKissanimeScraperHosterData = IHosterData<Hoster>;

export class KissanimeScraper extends HosterScraper<IKissanimeScraperHosterData> {
    public name: string = 'kissanime';
    public domains: string[] = ['kissanime.ru'];
    public urlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?kissanime\.ru\/Anime\/([a-zA-Z0-9\-]+)\/([a-zA-Z0-9\-]+)\?id=(\d+)/i;
    public runner: PuppeteerRunner<IKissanimeScraperHosterData> = new PuppeteerRunner<IKissanimeScraperHosterData>();
    public defaultOptions: IKissanimeScraperOptions = {
        runnerOptions: {
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
        }
    };

    protected async exec(url: string, options: IKissanimeScraperOptions): Promise<IKissanimeScraperHosterData> {
        const parsed = urlparser.parse(url);
        parsed.query.parts.push('s=rapidvideo');
        url = parsed.toString();
        return new PuppeteerRunner<IKissanimeScraperHosterData>().run(url, async ({ page }) => {
            const gotoIfNotTarget = async _page => {
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

            const waitAndGetVideoFrameSource = async _page => {
                await _page.waitForSelector('#divContentVideo iframe');
                return _page.$eval('#divContentVideo iframe', frame => frame.src);
            };
            const defaultUrl = await waitAndGetVideoFrameSource(page);

            return {
                hosters: [new Hoster({
                    name: 'rapidvideo',
                    url: defaultUrl
                })]
            };
        }, options.runnerOptions);
    }
}
