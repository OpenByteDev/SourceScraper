import normalizeUrl = require('normalize-url');
import objectMerge = require('object-merge');

const _private = new WeakMap();

export class Hoster {
    public name: string;
    public quality?: string | number;
    public data?: string;

    constructor({ url, name, quality, data }: { url: string, name: string, quality?: string | number, data?: any }) {
        this.url = url;
        this.name = name;
        this.quality = quality;
        this.data = data;
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
