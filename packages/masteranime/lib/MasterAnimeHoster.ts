import { Host } from 'masteranime-api';
import { Hoster, IHoster } from 'sourcescrapper-core';

export interface IMasterAnimeHoster extends IHoster {
    host_id: number;
    embed_id: string;
    quality: number;
    type: number;
    host: Host;
}

export class MasterAnimeHoster extends Hoster implements IMasterAnimeHoster {
    public host_id: number;
    public embed_id: string;
    public quality: number;
    public type: number;
    public host: Host;

    constructor(hoster: IMasterAnimeHoster) {
        super(hoster);
        this.host_id = hoster.host_id;
        this.embed_id = hoster.embed_id;
        this.quality = hoster.quality;
        this.type = hoster.type;
        this.host = hoster.host;
    }
}
