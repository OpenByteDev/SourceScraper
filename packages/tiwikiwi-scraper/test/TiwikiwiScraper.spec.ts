import { TiwiKiwiScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://tiwi.kiwi/embed-kzs67oaxzzco.html'];
ScraperTester.fromStatic(TiwiKiwiScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
