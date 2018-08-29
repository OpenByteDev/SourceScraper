import { SimpleDomScraper } from 'source-scraper-dom-runner';

export class RapidvideoScraper extends SimpleDomScraper {
    public name: string = 'rapidvideo';
    public domains: string[] = ['rapidvideo.com'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?rapidvideo\.com\/\?v=([a-z\d]+)/i;
}
