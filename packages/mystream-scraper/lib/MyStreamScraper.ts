import { SimplePuppeteerScraper } from 'source-scraper-puppeteer-runner';

export class MyStreamScraper extends SimplePuppeteerScraper {
    public name: string = 'mystream';
    public domains: string[] = ['mystream.to'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?embed\.mystream\.to\/(\w+)/i;
}
