import { VerystreamScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://verystream.com/stream/3tngLkGr2pn/'];

ScraperTester.fromStatic(VerystreamScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
