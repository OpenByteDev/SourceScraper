import { TiwiKiwiScrapper } from '../lib';

import { ISourceData } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('TiwiKiwiScrapper', () => {
    const url = 'https://tiwi.kiwi/embed-kzs67oaxzzco.html';
    it('should detect a valid url', () => {
         const scrapper = new TiwiKiwiScrapper();
         scrapper.isApplicable(url).should.be.true;
    });
    it('should scrap data from a test page', async () => {
        const scrap = await TiwiKiwiScrapper.scrap(url);
        scrap.should.have.property('success').that.is.true;
        scrap.should.have.property('data').that.is.an('object');
        const data = scrap.data as ISourceData;
        data.should.have.property('sources').that.is.an('array');
        data.sources.length.should.be.greaterThan(0);
        data.sources.forEach(h => h.should.have.property('url').that.is.a('string'));
    });
});
