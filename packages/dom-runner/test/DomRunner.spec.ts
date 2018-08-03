import { DomRunner, IDomRunnerArgs } from '../lib';

import chai = require('chai');
import { JSDOM } from 'jsdom';
import 'mocha';
chai.should();

describe('DomRunner', () => {
    it('should provide valid args', async () => {
        const url = 'http://tekeye.uk/html/html5-video-test-page';
        const runner = new DomRunner<IDomRunnerArgs>();
        const args = await runner.run(url, a => Promise.resolve(a));
        args.should.have.property('jsdom').that.is.instanceOf(JSDOM);
        args.should.have.property('document').that.equals(args.jsdom.window.document);
        args.should.have.property('window').that.equals(args.jsdom.window);
    });
});
