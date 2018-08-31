import { StreamcloudScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['http://streamcloud.eu/94xhoh1ibe1k/SampleVideo_1280x720_1mb.mp4.html'];
ScraperTester.fromStatic(StreamcloudScraper)
	.testUrlDetection(urls)
    .testScraping(urls)
    .run();

