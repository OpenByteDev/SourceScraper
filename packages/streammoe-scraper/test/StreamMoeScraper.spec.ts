import { StreamMoeScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://stream.moe/embed2/0772361f2d432d93'];
ScraperTester.fromStatic(StreamMoeScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
