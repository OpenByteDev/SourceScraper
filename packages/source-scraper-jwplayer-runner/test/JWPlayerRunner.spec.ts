import { JWPlayerRunner, IJWPlayerRunnerArgs } from '../lib';

import { testArgs } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['https://tiwi.kiwi/kzs67oaxzzco'];
const runner = new JWPlayerRunner();
testArgs(runner, urls, (args: IJWPlayerRunnerArgs) => {

});
