import { VidziScrapper } from '../lib';

import { ISourceData } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('VidziScrapper', () => {
    it('should be able to scrap a video from a test page', async () => {
        const url = 'https://vidzi.nu/9q00u8jlom1t.html';
        VidziScrapper.DefaultOptions = {
            runnerOptions: {
                puppeteerConfig: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            }
        };
        const scrap = await VidziScrapper.scrap(url);
        scrap.should.have.property('success').that.is.a('boolean').and.that.is.true;
        scrap.should.have.property('data').that.is.an('object').and.that.is.not.undefined;
        const data = scrap.data as ISourceData;
        data.should.have.property('sources').that.is.an('array');
        data.sources.length.should.be.greaterThan(0);
        data.sources.forEach(h => h.should.have.property('url').that.is.a('string'));
    });
});
