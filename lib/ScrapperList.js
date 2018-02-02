const Scrapper = require('./Scrapper.js');

class ScrapperList {
    constructor(scrappers) {
        this.scrappers = scrappers.filter(s => s instanceof Scrapper);
    }
    getAllApplicable(url) {
        return this.scrappers.filter(s => s.isApplicable(url));
    }
    getFirstApplicable(url) {
        for (let s of this.scrappers)
            if (s.isApplicable(url))
                return s;
        return null;
    }
    get hosters() {
        return this.scrappers.flatMap(e => e.domain);
    }
}

module.exports = ScrapperList;