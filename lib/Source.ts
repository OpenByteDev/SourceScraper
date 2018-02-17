import normalizeUrl = require('normalize-url');
import objectMerge = require('object-merge');

const _private = new WeakMap();

export class Source {
    public type?: string;
    public codec?: string;
    public resolution?: string;

    constructor({ url, type, codec, resolution }: { url: string, type?: string, codec?: string, resolution?: string }) {
        this.type = type;
        this.codec = codec;
        this.resolution = resolution;
        this.url = url;
    }

    get url(): string {
        return _private.get(this).url;
    }
    set url(value: string) {
        (_private.get(this) || _private.set(this, {}).get(this)).url = normalizeUrl(value);
    }

    public toJSON(): object {
        return objectMerge(this, _private.get(this));
    }
}
