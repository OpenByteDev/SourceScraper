import { ISource, Source } from 'sourcescrapper-core';

export interface IVidziSource extends ISource {
    default: boolean;
    label: string;
    type: string;
    preload: string;
    codec: undefined;
    resolution: undefined;
}
export class VidziSource extends Source implements IVidziSource {
    public default: boolean;
    public label: string;
    public type: string;
    public preload: string;
    public codec: undefined;
    public resolution: undefined;

    constructor(source: IVidziSource) {
        super(source);
        this.default = source.default;
        this.type = source.type;
        this.label = source.label;
        this.preload = source.preload;
    }
}
