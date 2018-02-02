const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');

class Hoster {
    constructor({url, hoster}={}) {
        Object.defineProperties(this, {
            url: {
                get: () => url,
                set: value =>
                    url = typeOf(value) === 'string' ?
                        normalizeUrl(value) : null,
                enumerable: true
            },
            hoster: {
                get: () => hoster,
                set: value =>
                    hoster = typeOf(value) === 'string' ? value : null,
                enumerable: true
            }
        });
        this.url = url;
        this.type = type;
        this.codec = codec;
        this.resolution = resolution
    }
}

module.exports = Hoster;