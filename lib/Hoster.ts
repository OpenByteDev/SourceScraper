import normalizeUrl = require('normalize-url');
import objectMerge = require('object-merge');

const _private = new WeakMap();

export class Hoster {
    public name: string;

    constructor({ url, name }: { url: string, name: string }) {
        this.url = url;
        this.name = name;
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
