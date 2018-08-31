import { scrapers } from '../lib';

import chai = require('chai');
import 'mocha';
const should = chai.should();

describe('scrapers', () => {
    it('is exported', () => {
        should.exist(scrapers);
    });
    it('has source property', () => {
        scrapers.should.has.property('source').that.is.an('array');
    });
    it('has hoster property', () => {
        scrapers.should.has.property('hoster').that.is.an('array');
    });
    it('has all property', () => {
        scrapers.should.has.property('all').that.is.an('array');
    });
});
