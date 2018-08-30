import { ISource, Source } from 'source-scraper-core';

export interface IStreamangoSource extends ISource {
    bitrate: number;
    height: number;
    type: string;
}

export class StreamangoSource extends Source implements IStreamangoSource {
    public bitrate: number;
    public height: number;
    public type: string;

    constructor(source: IStreamangoSource) {
        super(source);
        this.bitrate = source.bitrate;
        this.height = source.height;
        this.type = source.type;
    }
}
