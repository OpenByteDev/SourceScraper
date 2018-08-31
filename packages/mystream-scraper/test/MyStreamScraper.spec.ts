import { MyStreamScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://embed.mystream.to/8g8peyzkqbll'];
ScraperTester.fromStatic(MyStreamScraper)
	.testUrlDetection(urls)
    .testScraping(urls)
    .run();

