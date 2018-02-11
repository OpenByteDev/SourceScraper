const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');
const urlparser = require('urlparser');

const Error = require('./Error.js');
const Scrap = require('./Scrap.js');

const runners = require('./runners.js');


class Scrapper {
    constructor({name='Scrapper', type, domain, runner, runnerOptions={}, exec}={}) {
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
        this.runnerOptions = runnerOptions;
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
        let info;
        if (typeOf(url) !== 'string')
            throw new TypeError('url must be a string');
        if (!(this.runner in runners))
            throw new TypeError('runner is not supported');
        try {
            info = await runners[this.runner].run({
                url: url,
                scrapper: this.exec,
                options: this.runnerOptions
            });
        } catch(err) {
            console.log(err);
            info = null; //new Error(1);
        }
        return new Scrap({
            info: info,
            url: url,
            scrapper: this
        });
    }
}

module.exports = Scrapper;