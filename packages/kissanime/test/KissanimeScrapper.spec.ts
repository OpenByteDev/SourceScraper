import { KissanimeScrapper } from '../lib';

import { IHosterData } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

describe('KissanimeScrapper', () => {
    const url = 'http://kissanime.ru/Anime/Shingeki-no-Kyojin-Season-3/Episode-001?id=148021';
    it('should detect a valid url', () => {
         const scrapper = new KissanimeScrapper();
         scrapper.isApplicable(url).should.be.true;
    });
    it('should scrap data from a test page', async () => {
        KissanimeScrapper.DefaultOptions = {
            runnerOptions: {
                puppeteerConfig: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            }
        };
        const scrap = await KissanimeScrapper.scrap(url);
        scrap.should.have.property('success').that.is.a('boolean').and.that.is.true;
        scrap.should.have.property('data').that.is.an('object').and.that.is.not.undefined;
        const data = scrap.data as IHosterData;
        data.should.have.property('hosters').that.is.an('array');
        data.hosters.length.should.be.greaterThan(0);
        data.hosters.forEach(h => h.should.have.property('url').that.is.a('string'));
    });
});
