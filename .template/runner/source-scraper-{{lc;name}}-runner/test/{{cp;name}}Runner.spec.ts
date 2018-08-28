import { {{cp;name}}Runner, I{{cp;name}}RunnerArgs } from '../lib';

import { testArgs } from 'source-scraper-test-utils';

import chai = require('chai');
chai.should();

const urls = ['{{testUrl}}'];
const runner = new {{cp;name}}Runner();
testArgs(runner, urls, (args: I{{cp;name}}RunnerArgs) => {

});
