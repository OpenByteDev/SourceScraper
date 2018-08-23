import { FlowplayerRunner } from '../lib';

import chai = require('chai');
import 'mocha';
chai.should();

describe('FlowplayerRunner', () => {
    it('should provide valid args', async () => {
        const url = 'https://vivo.sx/5ec5b4cd00';
        FlowplayerRunner.DefaultOptions = {
            puppeteerConfig: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        };
        return FlowplayerRunner.run(url, async ({ flowplayer, config, sources }) => {
            flowplayer.should.have.property('jsonValue').that.is.a('function');
            (await flowplayer.jsonValue()).should.be.an('object');
            config.should.be.an('object');
            Array.isArray(sources).should.be.true;
            return Promise.resolve({});
        });
    });
});
