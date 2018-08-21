import { ISource, Source } from 'sourcescrapper-core';

export interface IJWPlayerSource extends ISource {
    default: boolean;
    label: string;
    type: string;
    androidhls: boolean;
    preload: string;
}

export class JWPlayerSource extends Source implements IJWPlayerSource {
    public default: boolean;
    public label: string;
    public type: string;
    public androidhls: boolean;
    public preload: string;

    constructor(source: IJWPlayerSource) {
        super(source);
        this.default = source.default;
        this.label = source.label;
        this.type = source.type;
        this.androidhls = source.androidhls;
        this.preload = source.preload;
    }
}
