import objectMerge = require("object-merge");

import { Info } from './Info';
import { Hoster } from './Hoster';


const _private = new WeakMap();

export class HosterInfo extends Info {
    public title: string;
    constructor({ hoster, title }: { hoster?:Hoster[]|Hoster, title?:string } = {}) {
        super();

        this.hoster = typeof hoster === 'undefined' ? [] : Array.isArray(hoster) ? hoster : [hoster];
        this.title = title;
    }

    get hoster(): Hoster[] {
        return _private.get(this).hoster;
    }
    set hoster(value: Hoster[]) {
        (_private.get(this) || _private.set(this, {}).get(this)).hoster = value;
    }

    toJSON(): object {
        return objectMerge(this, _private.get(this));
    }
}