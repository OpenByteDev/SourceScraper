import { SimpleJWPlayerScraper } from 'source-scraper-jwplayer-runner';

export class VidziScraper extends SimpleJWPlayerScraper {
    public name: string = 'vidzi';
    public domains: string[] = ['vidzi.tv', 'vidzi.nu', 'vidzi.nu', 'vidzi.online'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?vidzi\.(?:tv|online|nu|si)\/(\w+)\.html/i;
}
