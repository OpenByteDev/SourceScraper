import { FlowplayerRunner } from '../lib';

import { RunnerTester } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['https://vivo.sx/5ec5b4cd00'];
RunnerTester.fromStatic(FlowplayerRunner)
    .testArgs(urls, async ({ flowplayer, config, sources }) => {
        flowplayer.should.have.property('jsonValue').that.is.a('function');
        (await flowplayer.jsonValue()).should.be.an('object');
        config.should.be.an('object');
        Array.isArray(sources).should.be.true;
    })
    .run();
