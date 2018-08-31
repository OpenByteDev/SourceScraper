import { VevioScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://vev.io/embed/n5o4x2gy1zr7', 'https://vev.io/86o7gmldwo0z'];
ScraperTester.fromStatic(VevioScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
