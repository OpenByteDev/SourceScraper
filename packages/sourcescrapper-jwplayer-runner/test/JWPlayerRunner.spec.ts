import { JWPlayerRunner } from '../lib';

import chai = require('chai');
import 'mocha';
chai.should();

describe('JWPlayerRunner', () => {
    it('should provide valid args', async () => {
        const url = 'https://tiwi.kiwi/kzs67oaxzzco';
        JWPlayerRunner.DefaultOptions = {
            puppeteerConfig: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        };
        return JWPlayerRunner.run(url, async ({ jwplayer, config, sources, poster }) => {
            jwplayer.should.have.property('jsonValue').that.is.a('function');
            (await jwplayer.jsonValue()).should.be.an('object');
            config.should.be.an('object');
            Array.isArray(sources).should.be.true;
            poster.should.be.a('string');
            return Promise.resolve({});
        });
    });
});
