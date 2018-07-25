import { ISource, Source } from 'sourcescrapper-core';

export interface IVidstreamingSource extends ISource {
    type: string;
    label: string;
    quality: undefined;
    resolution: undefined;
    codec: undefined;
}
export class VidstreamingSource extends Source implements IVidstreamingSource {
    public type: string;
    public label: string;
    public codec: undefined;
    public quality: undefined;
    public resolution: undefined;

    constructor(source: IVidstreamingSource) {
        super(source);
        this.type = source.type;
        this.label = source.label;
    }
}
