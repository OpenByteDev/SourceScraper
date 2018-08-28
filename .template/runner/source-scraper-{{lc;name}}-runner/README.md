# SourceScraper-{{cp;name}}Runner

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/source-scraper-{{lc;name}}-runner.svg)](https://www.npmjs.com/package/source-scraper-{{lc;name}}-runner)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2Fsource-scraper-{{lc;name}}-runner)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fsource-scraper-{{lc;name}}-runner)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2Fsource-scraper-{{lc;name}}-runner)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fsource-scraper-{{lc;name}}-runner&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

Provides the [{{cp;name}}Runner](https://openbytedev.github.io/SourceScraper/packages/source-scraper-{{lc;name}}-runner/docs/classes/{{lc;name}}runner.html) class for scrapping.

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i source-scraper-{{lc;name}}-runner
```


### Usage

```js
const { {{cp;name}}Runner } = require('source-scraper-{{lc;name}}-runner');

(async () => {
    const url = 'some url';
    const data = await new {{cp;name}}Runner().run(url, args => {
        // Extract data using args
    });
    // Do something with extracted data
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/source-scraper-{{lc;name}}-runner/docs/).
