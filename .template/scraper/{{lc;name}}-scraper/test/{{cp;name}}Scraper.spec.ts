import { {{cp;name}}Scraper } from '../lib';

import { testScraping, testUrlDetection } from 'source-scraper-test-utils';

const urls = ['{{testUrl}}'];
const scraper = new {{cp;name}}Scraper();
testUrlDetection(scraper, urls);
testScraping(scraper, urls);
