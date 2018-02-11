const Scrapper = require('./Scrapper.js');

class StreamScrapper extends Scrapper {
    constructor({name, domain, runner, runnerOptions={}, exec}={}) {
        super({name: name, type: 'stream', domain: domain, runner: runner, runnerOptions: runnerOptions, exec: exec});
    }
}

module.exports = StreamScrapper;