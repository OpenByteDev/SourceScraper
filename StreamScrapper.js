const Scrapper = require('./Scrapper.js');

class StreamScrapper extends Scrapper {
    constructor({name, domain, runner, exec}={}) {
        super({name: name, type: 'stream', domain: domain, runner: runner, exec: exec});
    }
}

module.exports = StreamScrapper;