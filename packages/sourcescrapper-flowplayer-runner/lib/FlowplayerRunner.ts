import { JSHandle } from 'puppeteer';
import { IRunner, IRunnerArgs, Runner } from 'sourcescrapper-core';
import { IPuppeteerRunnerArgs, IPuppeteerRunnerOptions, PuppeteerRunner } from 'sourcescrapper-puppeteer-runner';

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
    Flowplayer: JSHandle;
    config: IFlowplayerConfig;
    sources: IFlowplayerConfigSource[];
}

export interface IFlowplayerRunner<T> extends IRunner<T, IFlowplayerRunnerOptions, IFlowplayerRunnerArgs> { }

export class FlowplayerRunner<T> extends Runner<T, IFlowplayerRunnerOptions, IFlowplayerRunnerArgs>
    implements IFlowplayerRunner<T> {
    public static DefaultOptions: IFlowplayerRunnerOptions = {};
    public static async run<T>(
        url: string,
        scrapper: (args: IFlowplayerRunnerArgs) => Promise<T>,
        options?: IFlowplayerRunnerOptions): Promise<T> {
        return new FlowplayerRunner<T>().run(url, scrapper, options);
    }
    public defaultOptions: IFlowplayerRunnerOptions = FlowplayerRunner.DefaultOptions;
    protected async exec(
        url: string,
        scrapper: (args: IFlowplayerRunnerArgs) => Promise<T>,
        options: IFlowplayerRunnerOptions): Promise<T> {
        return PuppeteerRunner.run(url, async (args: IPuppeteerRunnerArgs) => {
            const { page } = args;
            const flowplayer = await page.evaluateHandle('flowplayer()');
            const config = await page.evaluate(player => player.conf, flowplayer);
            const sources = config.sources;
            try {
                return scrapper({
                    ...args,
                    flowplayer,
                    config,
                    sources
                });
            } finally {
                await flowplayer.dispose();
            }
        }, options);
    }
}
