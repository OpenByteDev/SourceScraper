import { OpenloadScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://openload.co/embed/t0jz0bXYJbY'];
ScraperTester.fromStatic(OpenloadScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
