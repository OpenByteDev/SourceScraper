import { SimpleDomScraper } from 'source-scraper-dom-runner';

export class MyStreamScraper extends SimpleDomScraper {
    public name: string = 'mystream';
    public domains: string[] = ['mystream.to'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?embed\.mystream\.to\/(\w+)/i;
}
