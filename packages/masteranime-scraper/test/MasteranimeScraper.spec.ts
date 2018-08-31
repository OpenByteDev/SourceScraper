import { MasteranimeScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://www.masterani.me/anime/watch/226-fullmetal-alchemist-brotherhood/1'];
ScraperTester.fromStatic(MasteranimeScraper)
	.testUrlDetection(urls)
    .testScraping(urls)
    .run();

