import { VidziScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://vidzi.nu/lof5im7eeuu3'];
ScraperTester.fromStatic(VidziScraper)
    .testUrlDetection(urls)
    // .testScraping(urls) <-- Vidzi service is currently unavailable
    .run();
