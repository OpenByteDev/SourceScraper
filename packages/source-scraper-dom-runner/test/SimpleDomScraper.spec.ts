import { SimpleDomScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://tekeye.uk/html/html5-video-test-page'];
ScraperTester.fromStatic(SimpleDomScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
