import { IMasteranimeHost } from './MasteranimeScraper';

import { Hoster, IHoster } from 'source-scraper-core';

export interface IMasteranimeHoster extends IHoster {
    host_id: number;
    embed_id: string;
    quality: number;
    type: number;
    host: IMasteranimeHost;
}

export class MasteranimeHoster extends Hoster implements IMasteranimeHoster {
    public host_id: number;
    public embed_id: string;
    public quality: number;
    public type: number;
    public host: IMasteranimeHost;

    constructor(hoster: IMasteranimeHoster) {
        super(hoster);
        this.host_id = hoster.host_id;
        this.embed_id = hoster.embed_id;
        this.quality = hoster.quality;
        this.type = hoster.type;
        this.host = hoster.host;
    }
}
