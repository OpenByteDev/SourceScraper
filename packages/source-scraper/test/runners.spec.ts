import { runners } from '../lib';

import chai = require('chai');
import 'mocha';
const should = chai.should();

describe('runners', () => {
    it('is exported', () => {
        should.exist(runners);
    });
    it('exports an array', () => {
        runners.should.be.an('array');
    });
});
