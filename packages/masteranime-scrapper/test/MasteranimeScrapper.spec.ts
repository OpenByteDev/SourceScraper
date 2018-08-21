import { MasteranimeScrapper } from '../lib';

import { IHosterData } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('MasteranimeScrapper', () => {
    const url = 'https://www.masterani.me/anime/watch/226-fullmetal-alchemist-brotherhood/1';
    it('should detect a valid url', () => {
         const scrapper = new MasteranimeScrapper();
         scrapper.isApplicable(url).should.be.true;
    });
    it('should scrap data from a test page', async () => {
        const scrap = await MasteranimeScrapper.scrap(url);
        scrap.should.have.property('success').that.is.true;
        scrap.should.have.property('data').that.is.an('object');
        const data = scrap.data as IHosterData;
        data.should.have.property('hosters').that.is.an('array');
        data.hosters.length.should.be.greaterThan(0);
        data.hosters.forEach(h => h.should.have.property('url').that.is.a('string'));
    });
});
