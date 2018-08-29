import { SimpleJWPlayerScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://tiwi.kiwi/kzs67oaxzzco'];
ScraperTester.fromStatic(SimpleJWPlayerScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
