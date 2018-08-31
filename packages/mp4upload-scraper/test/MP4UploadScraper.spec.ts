import { MP4UploadScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://mp4upload.com/embed-4gwq9pacjqx3.html'];
ScraperTester.fromStatic(MP4UploadScraper)
	.testUrlDetection(urls)
    .testScraping(urls)
    .run();

