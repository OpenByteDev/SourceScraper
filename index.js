const Error = require('./lib/Error.js');
const Source = require('./lib/Source.js');
const Info = require('./lib/Info.js');
const Scrap = require('./lib/Scrap.js');
const Scrapper = require('./lib/Scrapper.js');
const LinkScrapper = require('./lib/LinkScrapper.js');
const StreamScrapper = require('./lib/StreamScrapper.js');
const ScrapperList = require('./lib/ScrapperList.js');

const scrappers = require('./lib/scrappers.js');
const runners = require('./lib/runners.js');
const config = require('./lib/config.js');


module.exports = {
    scrappers: scrappers,
    runners: runners,
    classes: {
        Error: Error,
        Source: Source,
        Info: Info,
        Scrap: Scrap,
        Scrapper: Scrapper,
        LinkScrapper: LinkScrapper,
        StreamScrapper: StreamScrapper,
        ScrapperList: ScrapperList
    },
    config: config
};