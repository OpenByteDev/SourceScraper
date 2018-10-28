import { VidstreamingScraper } from '../lib';

import { ScraperTester } from 'source-scraper-test-utils';

const urls = [
    'http://vidstreaming.io/streaming.php?id=NzUwMDI=&title=Mob+Psycho+100+Episode+9',
    'https://vidstreaming.io/streaming.php?id=ODI1NTQ',
    'https://vidstreaming.io/streaming.php?id=ODI1NTc',
    'https://vidstreaming.io/streaming.php?id=ODI1NTk'
];
ScraperTester.fromStatic(VidstreamingScraper)
    .testUrlDetection(urls)
    .testScraping(urls)
    .run();
