import { MyStreamScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = [
    'https://embed.mystream.to/8g8peyzkqbll',
    'https://embed.mystream.to/wr35j4n3bh4b',
    'https://embed.mystream.to/eidkwo3kl05f',
    'https://embed.mystream.to/61n84ozx4fa7'
];
ScraperTester.fromStatic(MyStreamScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
