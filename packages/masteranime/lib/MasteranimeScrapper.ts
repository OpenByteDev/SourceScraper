import { MasteranimeHoster } from './MasteranimeHoster';

import { MasterAnimeAPI } from 'masteranime-api';
import { HosterScrapper, IHosterData, IScrapperOptions, Scrap } from 'sourcescrapper-core';

export interface IMasteranimeHosterData extends IHosterData {
    data: MasterAnimeAPI;
    hosters: MasteranimeHoster[];
}

export type IMasteranimeScrapperOptions = IScrapperOptions;

export class MasteranimeScrapper extends HosterScrapper<IMasteranimeHosterData> {
    public static Name: string = 'masteranime';
    public static Domains: string[] = ['masterani.me'];
    public static UrlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?masterani\.me\/anime\/watch\/(\d+-(?:\w+-)+\w+)\/(\d+)/i;
    public static DefaultOptions: IMasteranimeScrapperOptions = {};
    public static async scrap(
        url: string,
        options?: IMasteranimeScrapperOptions): Promise<Scrap<IMasteranimeHosterData>> {
        return new MasteranimeScrapper().scrap(url, options);
    }
    public name: string = MasteranimeScrapper.Name;
    public domains: string[] = MasteranimeScrapper.Domains;
    public urlPattern: RegExp = MasteranimeScrapper.UrlPattern;
    public defaultOptions: IMasteranimeScrapperOptions = MasteranimeScrapper.DefaultOptions;
    protected async exec(url: string): Promise<IMasteranimeHosterData> {
        const data = await MasterAnimeAPI.getEpisodeDetailedFromUrl(url);
        return {
            data,
            title: data.anime.info.title,
            hosters: data.mirrors.map(e => new MasteranimeHoster({
                name: e.host.name,
                quality: e.quality,
                url:
                (e.host.embed_prefix || '').replace(/\\\//g, '/') +
                e.embed_id +
                (e.host.embed_suffix || ''),
                host_id: e.host_id,
                embed_id: e.embed_id,
                host: e.host,
                type: e.type
            }))
        };
    }
}
