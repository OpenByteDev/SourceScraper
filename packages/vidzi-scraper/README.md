# Vidzi Scraper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/vidzi-scraper.svg)](https://www.npmjs.com/package/vidzi-scraper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2Fvidzi-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fvidzi-scraper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2Fvidzi-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fvidzi-scraper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scraper for [Vidzi](https://www.vidzi.tv/).

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i vidzi-scraper
```


### Usage

```js
const { vidziScraper } = require('vidzi-scraper');

(async () => {
    const url = 'some url';
    const scrap = await new vidziScraper().scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/vidzi-scraper/docs/).
