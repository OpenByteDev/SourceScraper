import { VidziSource } from './VidziSource';

import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';
import { IRunnerScrapperOptions, ISourceData, Scrap, SourceRunnerScrapper } from '../../sourcescrapper-core';

export interface IVidziSourceData extends ISourceData<VidziSource> {
    jwplayerConfig: IJWPlayerConfig;
    poster: string;
    title: string;
}

export interface ILocalization {
    player: string;
    play: string;
    playback: string;
    pause: string;
    stop: string;
    volume: string;
    prev: string;
    next: string;
    cast: string;
    airplay: string;
    fullscreen: string;
    playlist: string;
    hd: string;
    cc: string;
    audioTracks: string;
    playbackRates: string;
    replay: string;
    buffer: string;
    more: string;
    liveBroadcast: string;
    loadingAd: string;
    rewind: string;
    nextUp: string;
    nextUpClose: string;
    related: string;
    close: string;
    settings: string;
    unmute: string;
    copied: string;
    videoInfo: string;
}

export interface IVSource {
    default: boolean;
    file: string;
    label: string;
    type: string;
    preload: string;
}

export interface IAdvertising {
    client: string;
    tag: string;
    skipoffset: number;
    skipmessage: string;
}

export interface ICaptionsDetailed extends ICaptions {
    backgroundOpacity: number;
    edgeStyle?: any;
    fontSize: number;
    fontOpacity: number;
    fontScale: number;
    windowOpacity: number;
}

export interface ITrack {
    kind: string;
    default?: boolean;
    file: string;
}

export type IFeedData = object;

export interface IPlaylist {
    sources: IVSource[];
    tracks: ITrack[];
    minDvrWindow: number;
    dvrSeekLimit: number;
    image: string;
    preload: string;
    allSources: IVSource[];
    file: string;
    feedData: IFeedData;
}

export type IPlugins = any;

export interface ICaptions {
    back: boolean;
    color: string;
    fontFamily: string;
    fontsize: number;
}

export interface ISetupConfig {
    image: string;
    sources: IVSource[];
    tracks: ITrack[];
    height: string;
    base: string;
    hls_startfromlevel: number;
    hls_maxbufferlength: number;
    hls_maxbackbufferlength: number;
    advertising: IAdvertising;
    captions: ICaptions;
    width: string;
}

export type IItemMeta = object;

export type IMediaContainer = object;

export interface IPlaylistItem {
    sources: IVSource[];
    tracks: ITrack[];
    minDvrWindow: number;
    dvrSeekLimit: number;
    image: string;
    preload: string;
    allSources: IVSource[];
    file: string;
    feedData: IFeedData;
}

export interface ICaptionsListItem {
    id: string;
    label: string;
}

export interface IMediaElement {
    webkitWirelessVideoPlaybackDisabled: boolean;
}

export interface IProvider {
    name: string;
}

export interface IJWPlayerConfig {
    attached: boolean;
    autostart: boolean;
    bandwidthEstimate: number;
    bitrateSelection?: any;
    castAvailable: boolean;
    controls: boolean;
    defaultPlaybackRate: number;
    displaydescription: boolean;
    displaytitle: boolean;
    height: string;
    liveTimeout?: any;
    localization: ILocalization;
    mute: boolean;
    nextUpDisplay: boolean;
    playbackRateControls: boolean;
    playbackRates: number[];
    renderCaptionsNatively: boolean;
    repeat: boolean;
    stretching: string;
    volume: number;
    width: string;
    image: string;
    sources: IVSource[];
    tracks: ITrack[];
    base: string;
    hls_startfromlevel: number;
    hls_maxbufferlength: number;
    hls_maxbackbufferlength: number;
    advertising: IAdvertising;
    captions: ICaptionsDetailed;
    playbackRate: number;
    playlist: IPlaylist[];
    key: string;
    edition: string;
    error?: any;
    flashplayer: string;
    plugins: IPlugins;
    id: string;
    setupConfig: ISetupConfig;
    audioMode: boolean;
    flashBlocked: boolean;
    item: number;
    itemMeta: IItemMeta;
    playRejected: boolean;
    state: string;
    itemReady: boolean;
    feedData: IFeedData;
    playOnViewable: boolean;
    altText: string;
    fullscreen: boolean;
    logoWidth: number;
    scrubbing: boolean;
    mediaContainer: IMediaContainer;
    iFrame: boolean;
    activeTab: boolean;
    touchMode: boolean;
    inDom: boolean;
    playlistItem: IPlaylistItem;
    minDvrWindow: number;
    dvrSeekLimit: number;
    captionsIndex: number;
    captionsList: ICaptionsListItem[];
    captionsTrack?: any;
    mediaElement: IMediaElement;
    provider: IProvider;
    supportsPlaybackRate: boolean;
    containerWidth: number;
    containerHeight: number;
    visibility: number;
    viewable: number;
    cues: any[];
    intersectionRatio: number;
    streamType: string;
    position: number;
    duration: number;
    buffer: number;
    currentTime: number;
    instreamMode: boolean;
}

export type IVidziScrapperOptions = IRunnerScrapperOptions<IPuppeteerRunnerOptions>;

export class VidziScrapper extends SourceRunnerScrapper<IVidziSourceData> {
    public static Name: string = 'vidzi';
    public static Domains: string[] = ['vidzi.tv', 'vidzi.online', 'vidzi.nu'];
    public static UrlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?vidzi\.(?:tv|online|nu)\/(\w+)\.html/i;
    public static Runner: PuppeteerRunner<IVidziSourceData> = new PuppeteerRunner<IVidziSourceData>();
    public static DefaultOptions: IVidziScrapperOptions = {};
    public static async scrap(
        url: string,
        options?: IVidziScrapperOptions): Promise<Scrap<IVidziSourceData>> {
        return new VidziScrapper().scrap(url, options);
    }
    public static async scrapFromArgs(
        args: IPuppeteerRunnerArgs,
        options?: IVidziScrapperOptions): Promise<Scrap<IVidziSourceData>> {
        return new VidziScrapper().scrapFromArgs(args, options);
    }
    public name: string = VidziScrapper.Name;
    public domains: string[] = VidziScrapper.Domains;
    public urlPattern: RegExp = VidziScrapper.UrlPattern;
    public runner: PuppeteerRunner<IVidziSourceData> = VidziScrapper.Runner;
    public defaultOptions: IVidziScrapperOptions = VidziScrapper.DefaultOptions;
    protected async execWithArgs({ page }: IPuppeteerRunnerArgs): Promise<IVidziSourceData> {
        // tslint:disable-next-line
        let jwplayer; // remove typescript error "cannot find name 'jwplayer'"
        const config = await page.evaluate(() => jwplayer().getConfig());
        const playlistItem = config.playlistItem;
        const title = await page.$eval('.video-title', t => t.innerHTML);
        return {
            jwplayerConfig: config,
            poster: playlistItem.image,
            title,
            sources: playlistItem.allSources.map(s => new VidziSource({
                default: s.default,
                url: s.file,
                type: s.type,
                label: s.label,
                preload: s.preload,
                codec: undefined,
                resolution: undefined
            }))
        };
    }
}
