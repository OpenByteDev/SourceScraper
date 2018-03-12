import { Hoster } from './Hoster';
import { Info } from './Info';

export class HosterInfo extends Info {
    public title?: string;
    public hoster: Hoster[];

    constructor({ hoster, title }: { hoster?: Hoster[] | Hoster, title?: string } = {}) {
        super();

        this.hoster = typeof hoster === 'undefined' ? [] : Array.isArray(hoster) ? hoster : [hoster];
        this.title = title;
    }
}
