const typeOf = require('typeof');

const Info = require('./Info.js');

class HosterInfo extends Info {
    constructor({hoster}={}) {
        super();

        Object.defineProperties(this, {
            hoster: {
                get: () => hoster,
                set: value => {
                    const type = typeOf(value);
                    hoster =
                        type === 'undefined' || type === 'null' ? [] :
                            type === 'array' ? value :
                                [value]
                },
                enumerable: true
            }
        });
        this.hoster = hoster;
    }
}

module.exports = HosterInfo;