import { HtmlRunner, IHtmlRunnerArgs } from '../lib';

import chai = require('chai');
import 'mocha';
chai.should();

/*
data: T;
status: number;
statusText: string;
headers: any;
config: AxiosRequestConfig;
request?: any;
*/

describe('DomRunner', () => {
    it('should provide valid args', async () => {
        const url = 'http://tekeye.uk/html/html5-video-test-page';
        const runner = new HtmlRunner<IHtmlRunnerArgs>();
        const args = await runner.run(url, a => Promise.resolve(a));
        args.should.have.property('response').that.is.an('object');
        args.response.should.have.property('data').that.is.a('string');
        args.response.should.have.property('status').that.is.a('number');
        args.response.should.have.property('statusText').that.is.a('string');
        args.response.should.have.property('headers');
        args.response.should.have.property('config').that.is.an('object');
        args.response.should.have.property('request');
        args.should.have.property('html').that.is.a('string').and.that.equals(args.response.data);
    });
});
