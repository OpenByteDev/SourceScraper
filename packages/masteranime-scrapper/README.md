# Masteranime Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/masteranime-scrapper.svg)](https://www.npmjs.com/package/masteranime-scrapper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fmasteranime-scrapper)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fmasteranime-scrapper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fmasteranime-scrapper)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fmasteranime-scrapper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scrapper for [Masteranime](https://www.masterani.me/).

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i masteranime-scrapper
```


### Usage

```js
const { MasteranimeScrapper } = require('masteranime-scrapper');

(async () => {
    const url = 'some url';
    const scrap = await MasteranimeScrapper.scrap(url);
    if (scrap.success)
        console.log(scrap.data.hosters);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/masteranime-scrapper/docs/).
