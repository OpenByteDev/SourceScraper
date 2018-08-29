# SourceScraper-HtmlRunner

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/source-scraper-html-runner.svg)](https://www.npmjs.com/package/source-scraper-html-runner)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2Fsource-scraper-html-runner)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fsource-scraper-html-runner)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2Fsource-scraper-html-runner)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fsource-scraper-html-runner&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

Provides the [HtmlRunner](https://openbytedev.github.io/SourceScraper/packages/source-scraper-html-runner/docs/classes/htmlrunner.html) class for scrapping.

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i source-scraper-html-runner
```


### Usage

```js
const { HtmlRunner } = require('source-scraper-html-runner');

(async () => {
    const url = 'some url';
    const data = await new HtmlRunner().run(url, args => {
        // Extract data using args
    });
    // Do something with extracted data
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/source-scraper-html-runner/docs/).
