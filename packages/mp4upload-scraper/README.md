# MP4Upload Scraper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/mp4upload-scraper.svg)](https://www.npmjs.com/package/mp4upload-scraper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2Fmp4upload-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fmp4upload-scraper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2Fmp4upload-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2Fmp4upload-scraper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scraper for [MP4Upload](https://mp4upload.com/).

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i mp4upload-scraper
```


### Usage

```js
const { MP4UploadScraper } = require('mp4upload-scraper');

(async () => {
    const url = 'some url';
    const scrap = await new MP4UploadScraper().scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/mp4upload-scraper/docs/).
