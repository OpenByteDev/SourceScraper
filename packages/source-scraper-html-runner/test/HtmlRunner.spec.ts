import { HtmlRunner } from '../lib';

import { RunnerTester } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['https://tekeye.uk/html/html5-video-test-page'];
RunnerTester.fromStatic(HtmlRunner)
    .testArgs(urls, args => {
        args.should.have.property('response').that.is.an('object');
        args.response.should.have.property('data').that.is.a('string');
        args.response.should.have.property('status').that.is.a('number');
        args.response.should.have.property('statusText').that.is.a('string');
        args.response.should.have.property('headers');
        args.response.should.have.property('config').that.is.an('object');
        args.response.should.have.property('request');
        args.should.have.property('html').that.is.a('string').and.that.equals(args.response.data);
    })
    .run();
