import { RapidvideoScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://www.rapidvideo.com/?v=FO24ULAW2H'];
ScraperTester.fromStatic(RapidvideoScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
