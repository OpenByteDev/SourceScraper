import { PuppeteerRunner } from '../lib';

import chai = require('chai');
import 'mocha';
chai.should();

describe('PuppeteerRunner', () => {
    it('should provide valid args', async () => {
        const url = 'http://tekeye.uk/html/html5-video-test-page';
        PuppeteerRunner.DefaultOptions = {
            puppeteerConfig: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        };
        return PuppeteerRunner.run(url, ({ page, browser }) => {
            page.should.have.property('$').that.is.a('function');
            page.should.have.property('$eval').that.is.a('function');
            page.should.have.property('evaluate').that.is.a('function');
            browser.should.have.property('close').that.is.a('function');
            browser.should.have.property('newPage').that.is.a('function');
            return Promise.resolve({});
        }, { puppeteerConfig: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }});
    });
});
