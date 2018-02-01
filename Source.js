const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');

class Source {
    constructor({url, type, codec, resolution}={}) {
        Object.defineProperties(this, {
            url: {
                get: () => url,
                set: value =>
                    url = typeOf(value) === 'string' ?
                        normalizeUrl(value) : null,
                enumerable: true
            },
            type: {
                get: () => type,
                set: value =>
                    type = typeOf(value) === 'string' ? value : null,
                enumerable: true
            },
            codec: {
                get: () => codec,
                set: value =>
                    codec = typeOf(value) === 'string' ? value : null,
                enumerable: true
            },
            resolution: {
                get: () => resolution,
                set: value => {
                    const type = typeOf(value);
                    resolution = type === 'string' ? value :
                        type === 'number' ? String(value) : null
                },
                enumerable: true
            }
        });
        this.url = url;
        this.type = type;
        this.codec = codec;
        this.resolution = resolution
    }
}

module.exports = Source;