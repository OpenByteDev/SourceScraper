import { RapidvideoScrapper } from '../lib';

import { ISourceData } from '../../sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('RapidvideoScrapper', () => {
    const url = 'https://www.rapidvideo.com/?v=FO24ULAW2H';
    it('should detect a valid url', () => {
         const scrapper = new RapidvideoScrapper();
         scrapper.isApplicable(url).should.be.true;
    });
    it('should scrap data from a test page', async () => {
        const scrap = await RapidvideoScrapper.scrap(url);
        scrap.should.have.property('success').that.is.a('boolean').and.that.is.true;
        scrap.should.have.property('data').that.is.an('object').and.that.is.not.undefined;
        const data = scrap.data as ISourceData;
        data.should.have.property('sources').that.is.an('array');
        data.sources.length.should.be.greaterThan(0);
        data.sources.forEach(h => h.should.have.property('url').that.is.a('string'));
    });
});
