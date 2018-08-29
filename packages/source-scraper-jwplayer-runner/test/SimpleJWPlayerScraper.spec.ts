import { SimpleJWPlayerScraper } from '../lib';

import { testScraping, testUrlDetection } from 'source-scraper-test-utils';

const urls = ['https://tiwi.kiwi/kzs67oaxzzco'];
const scraper = new SimpleJWPlayerScraper();
testUrlDetection(scraper, urls);
testScraping(scraper, urls);
