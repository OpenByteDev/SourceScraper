# StreamMoe Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/streammoe-scrapper.svg)](https://www.npmjs.com/package/streammoe-scrapper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fstreammoe-scrapper)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fstreammoe-scrapper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fstreammoe-scrapper)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fstreammoe-scrapper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scrapper for [StreamMoe](https://www.stream.moe/).

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i streammoe-scrapper
```


### Usage

```js
const { StreamMoeScrapper } = require('streammoe-scrapper');

(async () => {
    const url = 'some url';
    const scrap = await StreamMoeScrapper.scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/streammoe-scrapper/docs/).
