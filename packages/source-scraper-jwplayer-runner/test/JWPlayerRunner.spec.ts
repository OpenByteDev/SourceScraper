import { JWPlayerRunner } from '../lib';

import { RunnerTester } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['https://tiwi.kiwi/kzs67oaxzzco'];
RunnerTester.fromStatic(JWPlayerRunner)
    .testArgs(urls, async ({ jwplayer, config, sources, poster }) => {
        jwplayer.should.have.property('jsonValue').that.is.a('function');
        (await jwplayer.jsonValue()).should.be.an('object');
        config.should.be.an('object');
        Array.isArray(sources).should.be.true;
        poster.should.be.a('string');
    })
    .run();
