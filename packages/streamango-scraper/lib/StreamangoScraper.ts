import { StreamangoSource } from './StreamangoSource';

import { IRunnerScraperOptions, ISourceData, SourceRunnerScraper } from 'source-scraper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'source-scraper-puppeteer-runner';

export type IStreamangoScraperOptions = IRunnerScraperOptions<IPuppeteerRunnerOptions>;

export type IStreamangoScraperSourceData = ISourceData<StreamangoSource>;

export class StreamangoScraper extends SourceRunnerScraper<IStreamangoScraperSourceData> {
    public name: string = 'streamango';
    public domains: string[] = ['streamango.com'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?streamango\.com\/embed\/(\w+)/i;
    public runner: PuppeteerRunner<IStreamangoScraperSourceData> = new PuppeteerRunner<IStreamangoScraperSourceData>();
    public defaultOptions: IStreamangoScraperOptions = {};

    protected async execWithArgs({ page }: IPuppeteerRunnerArgs): Promise<IStreamangoScraperSourceData> {
        // tslint:disable-next-line
        let srces; // remove typescript error "cannot find name 'srces'"
        const srcs = await page.evaluate(() => {
            for (const script of document.getElementsByTagName('script')) {
                if (script.src)
                    continue;
                if (script.text.includes('srces.push')) {
                    // tslint:disable-next-line
                    eval(script.innerText);
                    return srces;
                }
            }
        });
        return ({
            sources: srcs.map((s) => new StreamangoSource({
                url: s.src,
                type: s.type,
                resolution: s.height,
                height: s.height,
                bitrate: s.bitrate
            }))
        });
    }
}
