import { IStatic } from './IStatic';
import { Tester } from './Tester';

import {
    HosterScrapper, IHosterData, IScrapperOptions, ISourceData, Scrapper, SourceScrapper
} from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

export class ScrapperTester<T, SO extends IScrapperOptions, S extends Scrapper<T, SO>>
    extends Tester<S> {
    public static fromStatic<T, SO extends IScrapperOptions, S extends Scrapper<T, SO>>(
        runner: IStatic<S>
    ): ScrapperTester<T, SO, S> {
        return new ScrapperTester(new runner());
    }
    public scrapper: S;
    constructor(scrapper: S) {
        super();
        this.scrapper = scrapper;
    }
    public testUrlDetection(correctUrls: string[], incorrectUrls?: string[]): this {
        this.runTestForEach(
            correctUrls,
            'should detect a valid url',
            async url => this.scrapper.isApplicable(url).should.be.true);
        if (incorrectUrls)
            return this.runTestForEach(
                incorrectUrls,
                'should detect a valid url',
                async url => this.scrapper.isApplicable(url).should.be.true);
        return this;
    }
    public testScrapping(urls: string[], options?: SO): this {
        return this.runTestForEach(urls, 'should scrap data from a test page', async url => {
            const scrap = await this.scrapper.scrap(url, options);
            scrap.should.have.property('success').that.is.true;
            scrap.should.have.property('data').that.is.an('object');
            if (this.scrapper instanceof SourceScrapper) {
                const data = scrap.data as any as ISourceData;
                data.should.have.property('sources').that.is.an('array');
                data.sources.length.should.be.greaterThan(0);
                data.sources.forEach(s => s.should.have.property('url').that.is.a('string'));
            } else if (this.scrapper instanceof HosterScrapper) {
                const data = scrap.data as any as IHosterData;
                data.should.have.property('hosters').that.is.an('array');
                data.hosters.length.should.be.greaterThan(0);
                data.hosters.forEach(s => s.should.have.property('url').that.is.a('string'));
            } else throw new Error('Unexpected scrapper type');
        });
    }
    protected getTestTarget(): S {
        return this.scrapper;
    }
}
