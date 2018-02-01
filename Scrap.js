class Scrap {
    constructor({info, url, scrapper}={}) {
        this.info = info;
        this.url = url;
        this.scrapper = scrapper.name;
    }
}

module.exports = Scrap;