import { SimpleDomScrapper } from 'sourcescrapper-dom-runner';

export class RapidvideoScrapper extends SimpleDomScrapper {
    public static Name: string = 'rapidvideo';
    public static Domains: string[] = ['rapidvideo.com'];
    public static UrlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?rapidvideo\.com\/e\/(\w+)/i;
    public name: string = RapidvideoScrapper.Name;
    public domains: string[] = RapidvideoScrapper.Domains;
    public urlPattern: RegExp = RapidvideoScrapper.UrlPattern;
}
