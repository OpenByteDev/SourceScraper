import { ISource, Source } from 'sourcescrapper-core';

export interface IVidstreamingSource extends ISource {
    file: string;
    type: string;
    label: string;
}
export class VidstreamingSource extends Source implements IVidstreamingSource {
    public file: string;
    public type: string;
    public label: string;

    constructor(source: IVidstreamingSource) {
        super(source);
        this.file = source.file;
        this.type = source.type;
        this.label = source.label;
    }
}
