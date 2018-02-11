const Scrapper = require('./Scrapper.js');

class LinkScrapper extends Scrapper {
    constructor({name, domain, runner, runnerOptions={}, exec}={}) {
        super({name: name, type: "link", domain: domain, runner: runner, runnerOptions: runnerOptions, exec: exec});
    }
}

module.exports = LinkScrapper;