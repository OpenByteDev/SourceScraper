import { IRunnerScraperOptions, ISourceData, Source, SourceScraper } from 'source-scraper-core';
import { HtmlRunner, IHtmlRunnerOptions } from 'source-scraper-html-runner';

import removeNewlines = require('newline-remove');
import objectMerge = require('object-merge');
import queryString from 'querystring';
import execAll = require('regexp.execall');

export interface IJWPlayerSetupData {
    provider: string;
    flashplayer: string;
    file: string;
    image: string;
    height: number;
    width: number;
    abouttext: string;
    aboutlink: string;
    startparam: string;
}

export type IStreamcloudScraperOptions = IRunnerScraperOptions<IHtmlRunnerOptions>;

export interface IStreamcloudScraperSourceData extends ISourceData<Source> {
    setupData: IJWPlayerSetupData;
}

export class StreamcloudScraper extends SourceScraper<IStreamcloudScraperSourceData> {
    public name: string = 'streamcloud';
    public domains: string[] = ['streamcloud.eu'];
    public urlPattern: RegExp = /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?streamcloud\.eu\/(\w+)\/(.+)/i;
    public runner: HtmlRunner<string> = new HtmlRunner<string>();
    public defaultOptions: IStreamcloudScraperOptions = {
        runnerOptions: {
            axiosConfig: {
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cache-Control': 'no-cache',
                    'Connection': 'Keep-Alive',
                }
            }
        }
    };

    protected async exec(url: string, options: IStreamcloudScraperOptions): Promise<IStreamcloudScraperSourceData> {
        const dataRegex = /\/([^\/.]+)\/(.*)\.[^.]+/i;
        const data = dataRegex.exec(url);
        if (data === null || data.length <= 2)
            return Promise.reject(null);
        const id = data[1];
        const name = data[2];
        if (!id || !name)
            return Promise.reject(null);
        const html = await this.runner.run(
            url,
            async ({ html: _html }) => Promise.resolve(removeNewlines(_html)),
            objectMerge(options.runnerOptions, {
                axiosConfig: {
                    headers: {
                        Referer: url
                    },
                    data: queryString.stringify({
                        id,
                        fname: name,
                        hash: '',
                        op: 'download1',
                        referer: '',
                        usr_login: '',
                        imhuman: 'Weiter+zum+Video'
                    })
                }
            })
        );

        const configRegex = /jwplayer\("[^"]+"\).setup\({(.*?)}\);/i;
        const propRegex = /(\w+)\s*:\s*"?(.*?)"?\s*,/ig;
        const tabRegex = /(?:\\t|\t)/ig;
        const configData = configRegex.exec(html);
        if (!configData || configData.length < 1)
            return Promise.reject(null);
        const configRAW = configData[1].replace(tabRegex, '');
        const propData = execAll(propRegex, configRAW) as any[];
        const props: IJWPlayerSetupData = propData
            .filter(e => e !== null && e.length >= 2)
            .reduce((a, [, key, value]) => a[key] = value, {});
        return {
            setupData: props,
            poster: props.image,
            title: name,
            sources: [new Source({
                url: props.file,
                resolution: props.width + 'x' + props.height
            })]
        };
    }
}
