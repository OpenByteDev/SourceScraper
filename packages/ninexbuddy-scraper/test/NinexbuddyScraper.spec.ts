import { NinexbuddyScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = [
    'https://www.youtube.com/watch?v=OSRU7hC3HoQ',
    'https://www.masterani.me/anime/watch/2947-planet-with/1'
];
ScraperTester.fromStatic(NinexbuddyScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
