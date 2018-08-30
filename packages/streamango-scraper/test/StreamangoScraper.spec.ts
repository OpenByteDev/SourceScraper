import { StreamangoScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://streamango.com/embed/rrddobalkqkmebnt'];
ScraperTester.fromStatic(StreamangoScraper)
.testUrlDetection(urls)
    .testScraping(urls)
    .run();

