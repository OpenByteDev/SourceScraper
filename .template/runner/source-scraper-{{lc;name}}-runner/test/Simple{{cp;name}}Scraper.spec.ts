import { Simple{{cp;name}}Scraper } from '../lib';

import { testScraping, testUrlDetection } from 'source-scraper-test-utils';

const urls = ['{{testUrl}}'];
const scraper = new Simple{{cp;name}}Scraper();
testUrlDetection(scraper, urls);
testScraping(scraper, urls);
