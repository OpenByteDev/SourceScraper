import { ISource, Source } from 'source-scraper-core';

export interface IJWPlayerSource extends ISource {
    default: boolean;
    label: string;
    type: string;
    preload: string;
}

export class JWPlayerSource extends Source implements IJWPlayerSource {
    public default: boolean;
    public label: string;
    public type: string;
    public preload: string;

    constructor(source: IJWPlayerSource) {
        super(source);
        this.default = source.default;
        this.label = source.label;
        this.type = source.type;
        this.preload = source.preload;
    }
}
