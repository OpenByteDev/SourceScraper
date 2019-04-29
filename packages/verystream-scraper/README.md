# Verystream Scraper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/verystream-scraper.svg)](https://www.npmjs.com/package/verystream-scraper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2Fverystream-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fverystream-scraper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2Fverystream-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fverystream-scraper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scraper for [Verystream](https://verystream.com/).

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i verystream-scraper
```


### Usage

```js
const { VerystreamScraper } = require('verystream-scraper');

(async () => {
    const url = 'some url';
    const scrap = await new VerystreamScraper().scrap(url);
    if (scrap.success)
        console.log(scrap.data.runnerscrapers);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/verystream-scraper/docs/).
