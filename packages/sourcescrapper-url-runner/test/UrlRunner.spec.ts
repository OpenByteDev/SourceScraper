import { UrlRunner } from '../lib';

import chai = require('chai');
import 'mocha';
chai.should();

describe('UrlRunner', () => {
    it('should provide valid args', async () => {
        const url = 'http://tekeye.uk/html/html5-video-test-page';
        return UrlRunner.run(url, args => {
            args.should.have.property('url').that.is.a('string').and.that.equals(url);
            return Promise.resolve({});
        });
    });
});
