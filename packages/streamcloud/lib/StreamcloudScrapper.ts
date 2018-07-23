import { integer, Source, SourceData, SourceScrapper, uri } from 'sourcescrapper-core';
import { HtmlRunner } from 'sourcescrapper-html-runner';

import removeNewlines = require('newline-remove');
import queryString from 'querystring';

export interface JWPlayerSetupData {
    provider: string;
    flashplayer: uri;
    file: uri;
    image: uri;
    height: integer;
    width: integer;
    abouttext: string;
    aboutlink: uri;
    startparam: string;
}
export interface StreamcloudSourceData extends SourceData {
    setupData: JWPlayerSetupData;
}
export class StreamcloudScrapper extends SourceScrapper {
    public name: string = 'streamcloud';
    public domains: string[] = ['streamcloud.eu'];
    public urlPattern: RegExp = /https?:\/\/streamcloud\.eu\/(\w+)\/(.+)/;
    public async run(url: uri): Promise<StreamcloudSourceData> {
        const dataRegex = new RegExp(/\/([^\/.]+)\/(.*)\.[^.]+/, 'i');
        const data = dataRegex.exec(url);
        if (data === null || data.length <= 2)
            return Promise.reject(null);
        const id = data[1];
        const name = data[2];
        if (!id || !name)
            return Promise.reject(null);
        const html = await HtmlRunner.run(
            url,
            ({ html: _html }) => Promise.resolve(removeNewlines(_html)),
            {
                axiosConfig: {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cache-Control': 'no-cache',
                        'Connection': 'Keep-Alive',
                        'Referer': url
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
            }
            );

        const configRegex = new RegExp(/jwplayer\("[^"]+"\).setup\({(.*?)}\);/, 'i');
        const propRegex = new RegExp(/(\w+)\s*:\s*"?(.*?)"?\s*,/, 'ig');
        const tabRegex = /(?:\\t|\t)/g;
        const configData = configRegex.exec(html);
        if (!configData || configData.length < 1)
            return Promise.reject(null);
        const configRAW = configData[1].replace(tabRegex, '');
        const propData = propRegex.execAll(configRAW) as any[];
        const props: JWPlayerSetupData = propData
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
