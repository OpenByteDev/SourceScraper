import { JSHandle } from 'puppeteer';
import { IRunner, IRunnerArgs, Runner } from 'sourcescrapper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface IJWPlayerConfigSource {
    default: boolean;
    file: string;
    label: string;
    type: string;
    preload: string;
}

export interface IJWPlayerTrack {
    file: string;
    default?: boolean;
    kind: string;
}

export interface IJWPlayerCaptions {
    color: string;
    fontSize: number;
    fontFamily: string;
    backgroundOpacity: number;
}

export interface IJWPlayerSharing {
    code: string;
    link: string;
}

export interface IJWPlayerPlaylist {
    sources: IJWPlayerConfigSource[];
    tracks: IJWPlayerTrack[];
    image: string;
    preload: string;
    allSources: IJWPlayerConfigSource[];
    file: string;
}

export interface IJWPlayerCaptionsList {
    id: string;
    label: string;
}

export interface IJWPlayerProvider {
    name: string;
}

export interface IJWPlayerDock {
    tooltip: string;
    id: string;
    btnClass: string;
}

export interface IJWPlayerErrorEvent {
    message: string;
}

export interface IJWPlayerConfig {
    autostart: boolean;
    controls: boolean;
    displaytitle: boolean;
    displaydescription: boolean;
    mobilecontrols: boolean;
    repeat: boolean;
    castAvailable: boolean;
    skin: string;
    mute: boolean;
    volume: number;
    width: number;
    height: number;
    flashplayer: string;
    sources: IJWPlayerConfigSource[];
    dash: boolean;
    image: string;
    duration: number;
    androidhls: boolean;
    startparam: string;
    preload: string;
    'http.startparam': string;
    primary: string;
    tracks: IJWPlayerTrack[];
    captions: IJWPlayerCaptions;
    sharing: IJWPlayerSharing;
    abouttext: string;
    aboutlink: string;
    id: string;
    base: string;
    playlist: IJWPlayerPlaylist[];
    item?: any;
    state: string;
    flashBlocked: boolean;
    fullscreen: boolean;
    compactUI: boolean;
    scrubbing: boolean;
    position: number;
    buffer: number;
    'skin-loading': boolean;
    key: string;
    edition: string;
    plugins: object;
    mediaContainer: object;
    flashPlugins: any[];
    captionsList: IJWPlayerCaptionsList[];
    captionsIndex: number;
    captionsTrack?: any;
    provider: IJWPlayerProvider;
    containerWidth: number;
    containerHeight: number;
    dock: IJWPlayerDock[];
    errorEvent: IJWPlayerErrorEvent;
}

export type IJWPlayerRunnerOptions = IPuppeteerRunnerOptions;

export interface IJWPlayerRunnerArgs extends IPuppeteerRunnerArgs, IRunnerArgs<IJWPlayerRunnerOptions> {
    jwplayer: JSHandle;
    config: IJWPlayerConfig;
    sources: IJWPlayerConfigSource[];
    poster: string;
}

export interface IJWPlayerRunner<T> extends IRunner<T, IJWPlayerRunnerOptions, IJWPlayerRunnerArgs> { }

export class JWPlayerRunner<T> extends Runner<T, IJWPlayerRunnerOptions, IJWPlayerRunnerArgs>
    implements IJWPlayerRunner<T> {
    public static DefaultOptions: IJWPlayerRunnerOptions = {};
    public static async run<T>(
        url: string,
        scrapper: (args: IJWPlayerRunnerArgs) => Promise<T>,
        options?: IJWPlayerRunnerOptions): Promise<T> {
        return new JWPlayerRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: IJWPlayerRunnerOptions = JWPlayerRunner.DefaultOptions;
    protected async exec(
        url: string,
        scrapper: (args: IJWPlayerRunnerArgs) => Promise<T>,
        options: IJWPlayerRunnerOptions): Promise<T> {
        return PuppeteerRunner.run(url, async (args: IPuppeteerRunnerArgs) => {
            const { page } = args;
            const jwplayer = await page.evaluateHandle('jwplayer()');
            const config = await page.evaluate(player => player.getConfig(), jwplayer);
            const sources = config.sources;
            const poster = config.image;
            try {
                return scrapper({
                    ...args,
                    jwplayer,
                    config,
                    sources,
                    poster
                });
            } finally {
                await jwplayer.dispose();
            }
        }, options);
    }
}
