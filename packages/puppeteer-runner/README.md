# SourceScrapper-PuppeteerRunner

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/sourcescrapper-puppeteer-runner.svg)](https://www.npmjs.com/package/sourcescrapper-puppeteer-runner)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fpuppeteer-runner)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fpuppeteer-runner)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fpuppeteer-runner)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fpuppeteer-runner&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

Provides the [PuppeteerRunner](https://openbytedev.github.io/SourceScrapper/packages/puppeteer-runner/docs/classes/puppeteerrunner.html) class for scrapping.

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i sourcescrapper-puppeteer-runner
```


### Usage

```js
const { PuppeteerRunner } = require('sourcescrapper-puppeteer-runner');

(async () => {
    const url = 'some url';
    const data = await PuppeteerRunner.run(url, args => {
        // Extract data using args
    });
    // Do something with extracted data
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/puppeteer-runner/docs/).
