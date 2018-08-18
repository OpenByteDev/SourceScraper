# MP4Upload Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/mp4upload-scrapper.svg)](https://www.npmjs.com/package/mp4upload-scrapper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fmp4upload)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fmp4upload)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fmp4upload)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fmp4upload&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scrapper for [MP4Upload](https://www.mp4upload.com/).

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i mp4upload-scrapper
```


### Usage

```js
const { MP4UploadScrapper } = require('mp4upload-scrapper');

(async () => {
    const url = 'some url';
    const scrap = await MP4UploadScrapper.scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/mp4upload/docs/).
