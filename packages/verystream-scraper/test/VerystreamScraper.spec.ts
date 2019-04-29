import { VerystreamScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = ['https://verystream.com/e/FYTgmNnQ5HE/'];

ScraperTester.fromStatic(VerystreamScraper)
  .testUrlDetection(urls)
  .testScraping(urls)
  .run();
