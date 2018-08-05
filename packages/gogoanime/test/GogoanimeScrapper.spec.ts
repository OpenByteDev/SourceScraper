import { GogoanimeScrapper } from '../lib';

import { IHosterData } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('GogoanimeScrapper', () => {
    it('should be able to scrap a video from a test page', async () => {
        const url = 'https://gogoanime.sh/shingeki-no-kyojin-season-3-episode-3';
        const scrap = await GogoanimeScrapper.scrap(url);
        scrap.should.have.property('success').that.is.a('boolean').and.that.is.true;
        scrap.should.have.property('data').that.is.an('object').and.that.is.not.undefined;
        const data = scrap.data as IHosterData;
        data.should.have.property('hosters').that.is.an('array');
        data.hosters.length.should.be.greaterThan(0);
        data.hosters.forEach(h => h.should.have.property('url').that.is.a('string'));
    });
});
