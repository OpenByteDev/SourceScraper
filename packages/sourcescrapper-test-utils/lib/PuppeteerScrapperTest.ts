import { IStatic } from './IStatic';
import { ScrapperTester } from './ScrapperTester';

import { IRunnerScrapperOptions, Scrapper } from 'sourcescrapper-core';
import { IPuppeteerRunnerOptions } from 'sourcescrapper-puppeteer-runner';

import chai = require('chai');
import 'mocha';
chai.should();

export class PuppeteerScrapperTester
<T, S extends Scrapper<T, IRunnerScrapperOptions<IPuppeteerRunnerOptions>>>
    extends ScrapperTester<T, IRunnerScrapperOptions<IPuppeteerRunnerOptions>, S> {
    public static fromStatic
    <T, SO extends IRunnerScrapperOptions<IPuppeteerRunnerOptions>, S extends Scrapper<T, SO>>(
        scrapper: IStatic<S>
    ): ScrapperTester<T, SO, S> {
        return new ScrapperTester(new scrapper());
    }
    public scrapper: S;
    constructor(scrapper: S) {
        super(scrapper);
        this.scrapper = scrapper;
    }
    public testScrapping(urls: string[]): this {
        this.scrapper.changeOptions({
            runnerOptions: {
                puppeteerConfig: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            }
        });
        return super.testScrapping(urls);
    }
}
