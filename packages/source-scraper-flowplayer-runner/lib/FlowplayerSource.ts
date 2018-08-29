import { ISource, Source } from 'source-scraper-core';

export interface IFlowplayerSource extends ISource {
    type: string;
}

export class FlowplayerSource extends Source implements IFlowplayerSource {
    public type: string;

    constructor(source: IFlowplayerSource) {
        super(source);
        this.type = source.type;
    }
}
