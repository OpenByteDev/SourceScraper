const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');

class Info {
    constructor({source, title, poster}={}) {
        Object.defineProperties(this, {
            source: {
                get: () => source,
                set: value => {
                    const type = typeOf(value);
                    source =
                        type === 'undefined' ? [] :
                        type === 'array' ? value :
                            [value]
                }, enumerable: true
            },
            poster: {
                get: () => poster,
                set: value =>
                    poster = typeOf(value) === 'string' ?
                        normalizeUrl(value) : null,
                enumerable: true
            },
            title: {
                get: () => title,
                set: value =>
                    title = typeOf(value) === 'string' ? value : null,
                enumerable: true
            }
        });
        this.source = source;
        this.title = title;
        this.poster = poster;
    }
}

module.exports = Info;