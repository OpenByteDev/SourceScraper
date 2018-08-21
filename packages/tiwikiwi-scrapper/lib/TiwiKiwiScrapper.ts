import { ISimpleJWPlayerScrapperOptions, SimpleJWPlayerScrapper } from 'sourcescrapper-jwplayer-runner';

export type ITiwiKiwiScrapperOptions = ISimpleJWPlayerScrapperOptions;

export class TiwiKiwiScrapper extends SimpleJWPlayerScrapper {
    public static Name: string = 'tiwikiwi';
    public static Domains: string[] = ['tiwi.kiwi'];
    public static UrlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?tiwi\.kiwi\/(embed-([0-9a-zA-Z]+)\.html|([0-9a-zA-Z]+))/i;
    public static DefaultOptions: ITiwiKiwiScrapperOptions = {};
}
