import { {{cp;name}}Runner } from '../lib';

import { RunnerTester } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['{{testUrl}}'];
RunnerTester.fromStatic({{cp;name}}Runner)
    .testArgs(urls, args => {

    })
    .run();
