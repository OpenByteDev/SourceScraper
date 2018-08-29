import { IStatic } from './IStatic';
import { Tester } from './Tester';

import {
    HosterScraper, IHosterData, IScraperOptions, ISourceData, Scraper, SourceScraper
} from 'source-scraper-core';

import chai = require('chai');
import 'mocha';
chai.should();

export class ScraperTester<T, SO extends IScraperOptions, S extends Scraper<T, SO>>
    extends Tester<S> {
    public static fromStatic<T, SO extends IScraperOptions, S extends Scraper<T, SO>>(
        runner: IStatic<S>
    ): ScraperTester<T, SO, S> {
        return new ScraperTester(new runner());
    }
    public scraper: S;
    constructor(scraper: S) {
        super();
        this.scraper = scraper;
    }
    public testUrlDetection(correctUrls: string[], incorrectUrls?: string[]): this {
        return this.addTest(
            'should detect a valid url',
            () =>  {
                correctUrls.forEach(url => this.scraper.isApplicable(url).should.be.true);
                if (incorrectUrls)
                    incorrectUrls.forEach(url => this.scraper.isApplicable(url).should.be.false);
            }
        );
    }
    public testScraping(urls: string[], options?: SO): this {
        return this.addTest(
            'should scrap data from a test page',
            () => urls.forEach(async url => {
                const scrap = await this.scraper.scrap(url, options);
                scrap.should.have.property('success').that.is.true;
                scrap.should.have.property('data').that.is.an('object');
                if (this.scraper instanceof SourceScraper) {
                    const data = scrap.data as any as ISourceData;
                    data.should.have.property('sources').that.is.an('array');
                    data.sources.length.should.be.greaterThan(0);
                    data.sources.forEach(s => s.should.have.property('url').that.is.a('string'));
                } else if (this.scraper instanceof HosterScraper) {
                    const data = scrap.data as any as IHosterData;
                    data.should.have.property('hosters').that.is.an('array');
                    data.hosters.length.should.be.greaterThan(0);
                    data.hosters.forEach(s => s.should.have.property('url').that.is.a('string'));
                } else throw new Error('Unexpected scraper type');
            })
        );
    }
    protected getTestTarget(): S {
        return this.scraper;
    }
}
