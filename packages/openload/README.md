# Openload Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/openload-scrapper.svg)](https://www.npmjs.com/package/openload-scrapper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fopenload)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fopenload)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fopenload)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fopenload&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scrapper for [Openload](https://www.oload.tv/).

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i openload-scrapper
```


### Usage

```js
const { OpenloadScrapper } = require('openload-scrapper');

(async () => {
    const url = 'some url';
    const scrap = await OpenloadScrapper.scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/openload/docs/).
