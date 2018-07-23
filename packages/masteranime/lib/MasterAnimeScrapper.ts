import { Hoster, HosterData, HosterScrapper } from 'sourcescrapper-core';

import { MasterAnimeAPI } from 'masteranime-api';

export interface MasterAnimeHosterData extends HosterData {
    data: MasterAnimeAPI;
}
export class MasterAnimeScrapper extends HosterScrapper {
    public name: string = 'masteranime';
    public domains: string[] = ['masterani.me'];
    public urlPattern: RegExp = /https?:\/\/(www\.)?masterani\.me\/anime\/watch\/(\d+-(?:\w+-)+\w+)\/(\d+)/i;
    public async run(url: string): Promise<MasterAnimeHosterData> {
        const data = await MasterAnimeAPI.getEpisodeDetailedFromUrl(url);
        return {
            data,
            title: data.anime.info.title,
            hosters: data.mirrors.map(e => new Hoster({
                name: e.host.name,
                quality: e.quality,
                url:
                (e.host.embed_prefix || '').replace(/\\\//g, '/') +
                e.embed_id +
                (e.host.embed_suffix || ''),
            }))
        };
    }
}
