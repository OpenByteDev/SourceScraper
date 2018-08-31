import { TiwikiwiScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://tiwi.kiwi/embed-kzs67oaxzzco.html'];
ScraperTester.fromStatic(TiwikiwiScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
