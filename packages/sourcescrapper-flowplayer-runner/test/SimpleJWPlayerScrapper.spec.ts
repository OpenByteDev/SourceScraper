import { SimpleFlowplayerScrapper } from '../lib';

import { ISourceData } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('SimpleFlowplayerScrapper', () => {
    const url = 'https://vivo.sx/5ec5b4cd00';
    it('should detect a valid url', () => {
         const scrapper = new SimpleFlowplayerScrapper();
         scrapper.isApplicable(url).should.be.true;
    });
    it('should scrap data from a test page', async () => {
        SimpleFlowplayerScrapper.DefaultOptions = {
            runnerOptions: {
                puppeteerConfig: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            }
        };
        const scrap = await SimpleFlowplayerScrapper.scrap(url);
        scrap.should.have.property('success').that.is.true;
        scrap.should.have.property('data').that.is.an('object');
        const data = scrap.data as ISourceData;
        data.should.have.property('sources').that.is.an('array');
        data.sources.length.should.be.greaterThan(0);
        data.sources.forEach(s => s.should.have.property('url').that.is.a('string'));
    });
});
