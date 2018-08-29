import { PuppeteerRunner } from '../lib';

import { RunnerTester } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['https://tekeye.uk/html/html5-video-test-page'];
RunnerTester.fromStatic(PuppeteerRunner)
    .testArgs(urls, ({ page, browser }) => {
        page.should.have.property('$').that.is.a('function');
        page.should.have.property('$eval').that.is.a('function');
        page.should.have.property('evaluate').that.is.a('function');
        browser.should.have.property('close').that.is.a('function');
        browser.should.have.property('newPage').that.is.a('function');
    })
    .run();
