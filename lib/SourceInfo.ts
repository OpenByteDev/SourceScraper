import normalizeUrl = require('normalize-url');

import { Info } from './Info';
import { Source } from './Source';

export class SourceInfo extends Info {
    public source: Source[];
    public title?: string;
    public poster?: string;

    constructor({ source, title, poster }: { source?: Source[] | Source, title?: string, poster?: string } = {}) {
        super();

        this.source = typeof source === 'undefined' ? [] : Array.isArray(source) ? source : [source];
        this.title = title;
        this.poster = typeof poster === 'undefined' ? undefined : normalizeUrl(poster);
    }
}
