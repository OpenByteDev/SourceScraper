import { SimpleFlowplayerScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://vivo.sx/5ec5b4cd00'];
ScraperTester.fromStatic(SimpleFlowplayerScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
