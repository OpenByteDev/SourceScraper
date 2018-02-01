const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');
const urlparser = require('urlparser');

const Error = require('./Error.js');
const Scrap = require('./Scrap.js');

const runners = require('./runners.js');


class Scrapper {
    constructor({name, type, domain, runner, exec}={}) {
        Object.defineProperties(this, {
            type: {
                get: () => type,
                set: value => type = value.toLowerCase(),
                enumerable: true
            },
            domain: {
                get: () => domain,
                set: value => domain = (typeOf(value) === 'array' ? value : [value]).map(d => d.toLowerCase()),
                enumerable: true
            },
            runner: {
                get: () => runner,
                set: value => runner = value.toLowerCase(),
                enumerable: true
            }
        });
        this.name = name;
        this.type = type;
        this.domain = domain;
        this.runner = runner;
        this.exec = exec;
    }
    isApplicable(url) {
        if (typeOf(url) !== 'string')
            return false;
        url = normalizeUrl(url);
        const u = urlparser.parse(url);
        return this.domain.some(d => u.host.hostname.includes(d));
    }
    async run(url) {
        if (typeOf(url) !== 'string')
            return null;
        if (!(this.runner in runners))
            return null;
        try {
            const info = await runners[this.runner].run(url, this.exec);
            return info ? new Scrap({
                info: info,
                url: url,
                scrapper: this
            }) : null;
        } catch(err) {
            console.log(err);
            return new Error(1);
        }
    }
}

module.exports = Scrapper;