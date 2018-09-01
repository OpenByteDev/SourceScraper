import { ISource, Source } from 'source-scraper-core';

export interface INinexbuddySourceQuality {
    raw: string;
    value: number;
    unit: string;
    description: string;
}

export interface INinexbuddySource extends ISource {
    quality?: INinexbuddySourceQuality;
    codec: undefined;
}

export class NinexbuddySource extends Source implements INinexbuddySource {
    public quality?: INinexbuddySourceQuality;
    public codec: undefined;

    constructor(source: INinexbuddySource) {
        super(source);
        this.quality = source.quality;
    }
}
