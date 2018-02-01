const Error = require('./Error.js');
const Source = require('./Source.js');
const Info = require('./Info.js');
const Scrap = require('./Scrap.js');
const Scrapper = require('./Scrapper.js');
const LinkScrapper = require('./LinkScrapper.js');
const StreamScrapper = require('./StreamScrapper.js');
const ScrapperList = require('./ScrapperList.js');

const scrappers = require('./scrappers.js');
const runners = require('./runners.js');
const config = require('./config.js');


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