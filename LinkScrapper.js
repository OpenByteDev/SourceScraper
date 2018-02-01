const Scrapper = require('./Scrapper.js');

class LinkScrapper extends Scrapper {
    constructor({name, domain, runner, exec}={}) {
        super({name: name, type: "link", domain: domain, runner: runner, exec: exec});
    }
}

module.exports = LinkScrapper;