import { MP4UploadSource } from './MP4UploadSource';

import { IRunnerScrapperOptions, ISourceData, Scrap, SourceRunnerScrapper } from 'sourcescrapper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface IMP4UploadSourceData extends ISourceData<MP4UploadSource> { }

export type IMP4UploadScrapperOptions = IRunnerScrapperOptions<IPuppeteerRunnerOptions>;

export class MP4UploadScrapper extends SourceRunnerScrapper<IMP4UploadSourceData> {
    public static Name: string = 'mp4upload';
    public static Domains: string[] = ['mp4upload.com'];
    public static UrlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?mp4upload\.com\/embed-([a-zA-Z0-9]+)\.html/i;
    public static Runner: PuppeteerRunner<IMP4UploadSourceData> = new PuppeteerRunner<IMP4UploadSourceData>();
    public static DefaultOptions: IMP4UploadScrapperOptions = { };
    public static async scrap(
        url: string,
        options?: IMP4UploadScrapperOptions): Promise<Scrap<IMP4UploadSourceData>> {
        return new MP4UploadScrapper().scrap(url, options);
    }
    public static async scrapFromArgs(
        args: IPuppeteerRunnerArgs,
        options?: IMP4UploadScrapperOptions): Promise<Scrap<IMP4UploadSourceData>> {
        return new MP4UploadScrapper().scrapFromArgs(args, options);
    }
    public name: string = MP4UploadScrapper.Name;
    public domains: string[] = MP4UploadScrapper.Domains;
    public urlPattern: RegExp = MP4UploadScrapper.UrlPattern;
    public runner: PuppeteerRunner<IMP4UploadSourceData> = MP4UploadScrapper.Runner;
    public defaultOptions: IMP4UploadScrapperOptions = MP4UploadScrapper.DefaultOptions;
    protected async execWithArgs({ page }: IPuppeteerRunnerArgs): Promise<IMP4UploadSourceData> {
        // tslint:disable-next-line
        let jwplayer; // remove typescript error "cannot find name 'jwplayer'"
        const config = await page.evaluate(() => jwplayer().getConfig().playlistItem);
        return {
            poster: config.image,
            sources: config.allSources.map(s => new MP4UploadSource({
                url: s.file,
                type: s.type,
                default: s.default,
                label: s.label,
                image: s.image
            }))
        };
    }
}
