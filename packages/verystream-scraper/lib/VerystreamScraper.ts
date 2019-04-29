import {
  IRunnerScraperOptions,
  ISourceData,
  Source,
  SourceRunnerScraper
} from 'source-scraper-core';
import {
  IPuppeteerRunnerArgs,
  IPuppeteerRunnerOptions,
  PuppeteerRunner
} from 'source-scraper-puppeteer-runner';
export type IVerystreamScraperOptions = IRunnerScraperOptions<
  IPuppeteerRunnerOptions
>;

export interface IVerystreamScraperSourceData extends ISourceData<Source> {
  streamurl: string;
}

export class VerystreamScraper extends SourceRunnerScraper<
  IVerystreamScraperSourceData
> {
  public name: string = 'verystream';
  public domains: string[] = ['verystream.com'];
  public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?(verystream\.com|oload\.(?:tv|win))\/e\/(\w+)/i;
  public runner: PuppeteerRunner<
    IVerystreamScraperSourceData
  > = new PuppeteerRunner<IVerystreamScraperSourceData>();
  public defaultOptions: IVerystreamScraperOptions = {};

  protected async execWithArgs({
    page
  }: IPuppeteerRunnerArgs): Promise<IVerystreamScraperSourceData> {
    const streamurl = await page.$eval(
      '[id*=stream], div[style*="display:none"] p:last-of-type',
      e => e.innerHTML
    );
    const title = await page
      .$eval(
        'meta[name="description"], meta[name="og:title"], meta[name="twitter:title"]',
        e => e.innerHTML
      )
      .catch(() => undefined);
    const thumb = await page
      .$eval(
        'meta[name="og:image"], meta[name="twitter:image"]',
        e => e.innerHTML
      )
      .catch(() => undefined);
    return {
      sources: [
        new Source({
          url: `https://verystream.com/gettoken/${await streamurl}?mime=true`
        })
      ],
      title,
      poster: thumb,
      streamurl
    };
  }
}
