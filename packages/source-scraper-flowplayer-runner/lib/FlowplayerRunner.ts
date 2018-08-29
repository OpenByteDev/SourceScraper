import { IRunner, IRunnerArgs, Runner } from 'source-scraper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'source-scraper-puppeteer-runner';

import { JSHandle } from 'puppeteer';

export interface IFlowplayerConfigSource {
    type: string;
    src: string;
}

export interface IFlowplayerClip {
    sources: IFlowplayerConfigSource[];
}

export interface IFlowplayerConfig {
    debug: boolean;
    disabled: boolean;
    fullscreen: boolean;
    keyboard: boolean;
    ratio: number;
    adaptiveRatio: boolean;
    rtmp: number;
    proxy: string;
    hlsQualities: boolean;
    splash: boolean;
    live: boolean;
    livePositionOffset: number;
    swf: string;
    swfHls: string;
    speeds: number[];
    tooltip: boolean;
    mouseoutTimeout: number;
    volume: number;
    errors: string[];
    errorUrls: string[];
    playlist: any[];
    hlsFix?: any;
    clip: IFlowplayerClip;
    logo: string;
    native_fullscreen: boolean;
    share: boolean;
    autoplay: boolean;
    hostname: string;
    origin: string;
}

export type IFlowplayerRunnerOptions = IPuppeteerRunnerOptions;

export interface IFlowplayerRunnerArgs extends IPuppeteerRunnerArgs, IRunnerArgs<IFlowplayerRunnerOptions> {
    flowplayer: JSHandle;
    config: IFlowplayerConfig;
    clip: IFlowplayerClip;
    sources: IFlowplayerConfigSource[];
}

export interface IFlowplayerRunner<T> extends IRunner<T, IFlowplayerRunnerOptions, IFlowplayerRunnerArgs> { }

export class FlowplayerRunner<T> extends Runner<T, IFlowplayerRunnerOptions, IFlowplayerRunnerArgs>
    implements IFlowplayerRunner<T> {
    public defaultOptions: IFlowplayerRunnerOptions = {};

    protected async exec(
        url: string,
        scraper: (args: IFlowplayerRunnerArgs) => Promise<T>,
        options: IFlowplayerRunnerOptions): Promise<T> {
        return new PuppeteerRunner<T>().run(url, async args => {
            const { page } = args;
            const flowplayer = await page.evaluateHandle('flowplayer()');
            const config = await page.evaluate(player => player.conf, flowplayer);
            const clip = config.clip;
            const sources = clip.sources;
            try {
                return scraper({
                    ...args,
                    flowplayer,
                    config,
                    clip,
                    sources
                });
            } finally {
                await flowplayer.dispose();
            }
        }, options);
    }
}
