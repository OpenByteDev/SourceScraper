import { {{cp;name}}Scraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['{{testUrl}}'];
ScraperTester.fromStatic({{cp;name}}Scraper)
	.testUrlDetection(urls)
    .testScraping(urls)
    .run();

