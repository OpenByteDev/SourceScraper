const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');

class Hoster {
    constructor({url, name}={}) {
        Object.defineProperties(this, {
            url: {
                get: () => url,
                set: value =>
                    url = typeOf(value) === 'string' ?
                        normalizeUrl(value) : null,
                enumerable: true
            },
            name: {
                get: () => name,
                set: value =>
                    name = typeOf(value) === 'string' ? value : null,
                enumerable: true
            }
        });
        this.url = url;
        this.name = name;
    }
}

module.exports = Hoster;