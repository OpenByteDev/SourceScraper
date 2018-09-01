import { INinexbuddySourceQuality, NinexbuddySource } from './NinexbuddySource';

import { Hoster, IHosterData, IRunnerScraperOptions, ISourceData, RunnerScraper } from 'source-scraper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'source-scraper-puppeteer-runner';

import u = require('url');

export type INinexbuddyScraperOptions = IRunnerScraperOptions<IPuppeteerRunnerOptions>;

export interface INinexbuddyScraperData {
    ninexbuddyUrl: string;
}

export interface INinexbuddyScraperSourceData extends INinexbuddyScraperData, ISourceData<NinexbuddySource> { }
export interface INinexbuddyScraperHosterData extends INinexbuddyScraperData, IHosterData<Hoster> { }

function parseSourceQuality(raw: string): INinexbuddySourceQuality | undefined {
    const ar1 = /^([a-zA-Z\d]+)\s*-\s*(\d+)([a-zA-Z]+)?$/i.exec(raw);
    if (ar1 !== null && ar1.length >= 4)
        return {
            raw,
            description: ar1[1],
            value: Number(ar1[2]),
            unit: ar1[3]
        };
    const ar2 = /^(\d+)([a-zA-Z]+)\s*\(?([a-zA-Z\s]+)\)?$/i.exec(raw);
    if (ar2 !== null && ar2.length >= 3)
        return {
            raw,
            description: ar2[3],
            value: Number(ar2[1]),
            unit: ar2[2]
        };
}

function parseHosterName(raw: string): string | undefined {
    const ar = /^(?:embed\s*-)?\s*([a-zA-Z\d.]+)$/i.exec(raw.trim());
    if (ar === null || ar.length < 2)
        return;
    return ar[ar.length - 1];
}

function isDefined<T>(value: T | undefined): value is T {
    return typeof value !== 'undefined';
}

export class NinexbuddyScraper extends
    RunnerScraper<
        INinexbuddyScraperSourceData | INinexbuddyScraperHosterData,
        IPuppeteerRunnerOptions,
        IPuppeteerRunnerArgs,
        PuppeteerRunner<INinexbuddyScraperSourceData | INinexbuddyScraperHosterData>> {
    public name: string = 'ninexbuddy';
    public domains: string[] = [];
    public urlPattern: RegExp = /.*/i;
    public runner: PuppeteerRunner<INinexbuddyScraperSourceData | INinexbuddyScraperHosterData> =
        new PuppeteerRunner<INinexbuddyScraperSourceData | INinexbuddyScraperHosterData>();
    public defaultOptions: INinexbuddyScraperOptions = {
        runnerOptions: {
            navigationOptions: {
                waitUntil: 'networkidle0'
            }
        }
    };

    protected transformUrl(url: string): string {
        return `https://9xbuddy.app/process?url=${url}`;
    }
    protected async execWithArgs({ page, url: ninexbuddyUrl }: IPuppeteerRunnerArgs):
        Promise<INinexbuddyScraperSourceData | INinexbuddyScraperHosterData> {
        const isHoster: boolean = !!(await page.$('.playlist_el').catch(() => false));
        if (isHoster) {
            const items = await page.$$('.playlist_el .text-blue');
            const hosters = (await Promise.all(items.map(async item => {
                const urlPromise =
                    item.getProperty('href').then(async e => e.jsonValue()).catch(() => undefined);
                const namePromise =
                    item.getProperty('textContent').then(async e => e.jsonValue()).catch(() => undefined);
                const [url, name] = await Promise.all([urlPromise, namePromise]);
                const hosterUrl = u.parse(url, true).query.url as string;
                if (!hosterUrl)
                    return;
                const parsed = name ? parseHosterName(name) : undefined;
                if (!parsed)
                    return;
                return new Hoster({
                    url: hosterUrl,
                    name: parsed,
                });
            }))).filter(isDefined);
            return {
                ninexbuddyUrl,
                hosters
            };
        } else {
            const selector = '.tracking-wide.items-center.night-white';
            const items = await page.$$(selector);
            const sources = (await Promise.all(items.map(async item => {
                const formatPromise = item.$eval('.w-24.text-blue', e => e.textContent).catch(() => undefined);
                const qualityPromise = item.$eval('.w-1\\/2', e => e.textContent).catch(() => undefined);
                const urlPromise =
                    item.$eval('.leading-normal.sm\\:leading-none', e => e.getAttribute('href')).catch(() => undefined);
                const [format, quality, url] = await Promise.all([formatPromise, qualityPromise, urlPromise]);
                if (!url)
                    return;
                return new NinexbuddySource({
                    url,
                    quality: quality ? parseSourceQuality(quality) : undefined,
                    type: format || undefined,
                    codec: undefined
                });
            }))).filter(isDefined);
            const poster = await page.$eval(
                'img.shadow.border-2.border-grey-lighter.h-48',
                e => (e as any as {src: string}).src).catch(() => undefined);
            return {
                ninexbuddyUrl,
                title: await page.title(),
                poster: poster && !poster.startsWith('data:image') ? poster : undefined,
                sources
            };
        }
    }
}
