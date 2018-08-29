import { KissanimeScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['http://kissanime.ru/Anime/Shingeki-no-Kyojin-Season-3/Episode-001?id=148021'];
ScraperTester.fromStatic(KissanimeScraper)
.testUrlDetection(urls)
    .testScraping(urls)
    .run();

