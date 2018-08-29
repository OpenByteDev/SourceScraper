import { GogoanimeScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://gogoanime.sh/shingeki-no-kyojin-season-3-episode-3'];
ScraperTester.fromStatic(GogoanimeScraper)
.testUrlDetection(urls)
    .testScraping(urls)
    .run();

