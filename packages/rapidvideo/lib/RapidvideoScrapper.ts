import { Scrap, SourceData } from 'sourcescrapper-core';
import { SimpleDomScrapper } from 'sourcescrapper-dom-runner';

export class RapidvideoScrapper extends SimpleDomScrapper {
    public static Name: string = 'rapidvideo';
    public static Domains: string[] = ['rapidvideo.com'];
    public static UrlPattern: RegExp = /https?:\/\/(www\.)?rapidvideo\.com\/e\/(\w+)/i;
    public static async scrap(url: string): Promise<Scrap<SourceData>> {
        return new RapidvideoScrapper().scrap(url);
    }
    public name: string = RapidvideoScrapper.Name;
    public domains: string[] = RapidvideoScrapper.Domains;
    public urlPattern: RegExp = RapidvideoScrapper.UrlPattern;
}
