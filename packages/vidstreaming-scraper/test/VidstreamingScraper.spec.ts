import { VidstreamingScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['http://vidstreaming.io/streaming.php?id=NzUwMDI=&title=Mob+Psycho+100+Episode+9'];
ScraperTester.fromStatic(VidstreamingScraper)
	.testUrlDetection(urls)
    .testScraping(urls)
    .run();

