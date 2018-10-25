import { SimpleFlowplayerScraper } from 'source-scraper-flowplayer-runner';

export class TiwikiwiScraper extends SimpleFlowplayerScraper {
    public name: string = 'tiwikiwi';
    public domains: string[] = ['tiwi.kiwi'];
    public urlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?tiwi\.kiwi\/(embed-([0-9a-zA-Z]+)\.html|([0-9a-zA-Z]+))/i;
}
