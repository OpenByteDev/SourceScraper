# StreamMoe Scraper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/streammoe-scraper.svg)](https://www.npmjs.com/package/streammoe-scraper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2Fstreammoe-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fstreammoe-scraper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2Fstreammoe-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fstreammoe-scraper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scraper for [StreamMoe](https://www.stream.moe/).

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i streammoe-scraper
```


### Usage

```js
const { streammoeScraper } = require('streammoe-scraper');

(async () => {
    const url = 'some url';
    const scrap = await new streammoeScraper().scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/streammoe-scraper/docs/).
