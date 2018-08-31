import { ISource, Source } from 'source-scraper-core';

export interface IVevioSource extends ISource {
    type: undefined;
    codec: undefined;
    resolution: string;
}

export class VevioSource extends Source implements IVevioSource {
    public type: undefined;
    public codec: undefined;
    public resolution: string;

    constructor(source: IVevioSource) {
        super(source);
        this.resolution = source.resolution;
    }
}
