import { ISource, Source } from '../../sourcescrapper-core';

export interface IMP4UploadSource extends ISource {
    default: boolean;
    label: string;
    type: string;
    image: string;
}

export class MP4UploadSource extends Source implements IMP4UploadSource {
    public default: boolean;
    public label: string;
    public type: string;
    public image: string;

    constructor(source: IMP4UploadSource) {
        super(source);
        this.default = source.default;
        this.label = source.label;
        this.type = source.type;
        this.image = source.image;
    }
}
