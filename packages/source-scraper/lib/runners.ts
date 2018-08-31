import { DomRunner } from 'source-scraper-dom-runner';
import { FlowplayerRunner } from 'source-scraper-flowplayer-runner';
import { HtmlRunner } from 'source-scraper-html-runner';
import { JWPlayerRunner } from 'source-scraper-jwplayer-runner';
import { PuppeteerRunner } from 'source-scraper-puppeteer-runner';

export = [
    new DomRunner(),
    new FlowplayerRunner(),
    new HtmlRunner(),
    new JWPlayerRunner(),
    new PuppeteerRunner()
];
