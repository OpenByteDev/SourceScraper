import { VidziSource } from './VidziSource';

import { Scrap, SourceData, SourceScrapper } from 'sourcescrapper-core';
import { PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

export interface VidziSourceData extends SourceData<VidziSource> {
    jwplayerConfig: JWPlayerConfig;
    poster: string;
    title: string;
}
export interface Localization {
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
export interface VSource {
    default: boolean;
    file: string;
    label: string;
    type: string;
    preload: string;
}
export interface Advertising {
    client: string;
    tag: string;
    skipoffset: number;
    skipmessage: string;
}
export interface CaptionsDetailed extends Captions {
    backgroundOpacity: number;
    edgeStyle?: any;
    fontSize: number;
    fontOpacity: number;
    fontScale: number;
    windowOpacity: number;
}
export interface Track {
    kind: string;
    default?: boolean;
    file: string;
}
export type FeedData = object;
export interface Playlist {
    sources: VSource[];
    tracks: Track[];
    minDvrWindow: number;
    dvrSeekLimit: number;
    image: string;
    preload: string;
    allSources: VSource[];
    file: string;
    feedData: FeedData;
}
export type Plugins = any;
export interface Captions {
    back: boolean;
    color: string;
    fontFamily: string;
    fontsize: number;
}
export interface SetupConfig {
    image: string;
    sources: VSource[];
    tracks: Track[];
    height: string;
    base: string;
    hls_startfromlevel: number;
    hls_maxbufferlength: number;
    hls_maxbackbufferlength: number;
    advertising: Advertising;
    captions: Captions;
    width: string;
}
export type ItemMeta = object;
export type MediaContainer = object;
export interface PlaylistItem {
    sources: VSource[];
    tracks: Track[];
    minDvrWindow: number;
    dvrSeekLimit: number;
    image: string;
    preload: string;
    allSources: VSource[];
    file: string;
    feedData: FeedData;
}
export interface CaptionsListItem {
    id: string;
    label: string;
}
export interface MediaElement {
    webkitWirelessVideoPlaybackDisabled: boolean;
}
export interface Provider {
    name: string;
}
export interface JWPlayerConfig {
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
    localization: Localization;
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
    sources: VSource[];
    tracks: Track[];
    base: string;
    hls_startfromlevel: number;
    hls_maxbufferlength: number;
    hls_maxbackbufferlength: number;
    advertising: Advertising;
    captions: CaptionsDetailed;
    playbackRate: number;
    playlist: Playlist[];
    key: string;
    edition: string;
    error?: any;
    flashplayer: string;
    plugins: Plugins;
    id: string;
    setupConfig: SetupConfig;
    audioMode: boolean;
    flashBlocked: boolean;
    item: number;
    itemMeta: ItemMeta;
    playRejected: boolean;
    state: string;
    itemReady: boolean;
    feedData: FeedData;
    playOnViewable: boolean;
    altText: string;
    fullscreen: boolean;
    logoWidth: number;
    scrubbing: boolean;
    mediaContainer: MediaContainer;
    iFrame: boolean;
    activeTab: boolean;
    touchMode: boolean;
    inDom: boolean;
    playlistItem: PlaylistItem;
    minDvrWindow: number;
    dvrSeekLimit: number;
    captionsIndex: number;
    captionsList: CaptionsListItem[];
    captionsTrack?: any;
    mediaElement: MediaElement;
    provider: Provider;
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
export class VidziScrapper extends SourceScrapper<VidziSourceData> {
    public static Name: string = 'vidzi';
    public static Domains: string[] = ['vidzi.tv', 'vidzi.online', 'vidzi.nu'];
    public static UrlPattern: RegExp = /https?:\/\/(?:www\.)?vidzi\.(?:tv|online|nu)\/(\w+)\.html/i;
    public static async scrap(url: string): Promise<Scrap<VidziSourceData>> {
        return new VidziScrapper().scrap(url);
    }
    public name: string = 'vidzi';
    public domains: string[] = ['vidzi.tv', 'vidzi.online', 'vidzi.nu'];
    public urlPattern: RegExp = /https?:\/\/(?:www\.)?vidzi\.(?:tv|online|nu)\/(\w+)\.html/i;
    protected async run(url: string): Promise<VidziSourceData> {
        return PuppeteerRunner.run(url, async ({ page }) => {
            // tslint:disable-next-line
            let jwplayer; // remove typescript error "cannot find name 'jwplayer'"
            const config = await page.evaluate(() => jwplayer().getConfig());
            const playlistItem = config.playlistItem;
            const title = await page.$eval('.video-title', (t) => t.innerText);
            return {
                jwplayerConfig: config,
                poster: playlistItem.image,
                title,
                sources: playlistItem.allSources.map(s => new VidziSource({
                    default: s.default,
                    url: s.file,
                    type: s.type,
                    label: s.label,
                    preload: s.preload
                }))
            };
        });
    }
}
