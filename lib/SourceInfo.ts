import normalizeUrl = require('normalize-url');
import objectMerge = require('object-merge');

import { Info } from './Info';
import { Source } from './Source';

const _private = new WeakMap();

export class SourceInfo extends Info {
    public source: Source[];
    public title?: string;

    constructor({ source, title, poster }: { source?: Source[] | Source, title?: string, poster?: string } = {}) {
        super();

        this.source = typeof source === 'undefined' ? [] : Array.isArray(source) ? source : [source];
        this.title = title;
        this.poster = poster;
    }

    get poster(): string | undefined {
        return _private.get(this).poster;
    }
    set poster(value: string | undefined) {
        (_private.get(this) || _private.set(this, {}).get(this)).poster =
            typeof value === 'undefined' ? value : normalizeUrl(value);
    }

    public toJSON(): object {
        return objectMerge(this, _private);
    }
}
