import { DomRunner } from '../lib';

import { RunnerTester } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

import { JSDOM } from 'jsdom';

const urls = ['https://tekeye.uk/html/html5-video-test-page'];
RunnerTester.fromStatic(DomRunner)
    .testArgs(urls, args => {
        args.should.have.property('jsdom').that.is.instanceOf(JSDOM);
        args.should.have.property('document').that.equals(args.jsdom.window.document);
        args.should.have.property('window').that.equals(args.jsdom.window);
    })
    .run();
