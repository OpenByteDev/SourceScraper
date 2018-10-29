import { IRunner, IRunnerArgs, Runner } from 'source-scraper-core';
import {
    IPuppeteerRunner, IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner
} from 'source-scraper-puppeteer-runner';

import { JSHandle } from 'puppeteer';

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
    implements IJWPlayerRunner<T>, IPuppeteerRunner<T> {
    public defaultOptions: IJWPlayerRunnerOptions = {};

    protected async exec(
        url: string,
        scraper: (args: IJWPlayerRunnerArgs) => Promise<T>,
        options: IJWPlayerRunnerOptions): Promise<T> {
        return new PuppeteerRunner<T>().run(url, async args => {
            const { page } = args;
            const jwplayer = await page.evaluateHandle('jwplayer()');
            const config = await page.evaluate(player => player.getConfig(), jwplayer);
            const sources = config.playlist || [config.playlistItem] || [config];
            const poster = config.image;
            try {
                return scraper({
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
