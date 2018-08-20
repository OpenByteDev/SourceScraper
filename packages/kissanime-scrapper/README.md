# Kissanime Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/kissanime-scrapper.svg)](https://www.npmjs.com/package/kissanime-scrapper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fkissanime-scrapper)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fkissanime-scrapper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fkissanime-scrapper)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fkissanime-scrapper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scrapper for [Kissanime](https://www.kissanime.ru/).

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i kissanime-scrapper
```


### Usage

```js
const { KissanimeScrapper } = require('kissanime-scrapper');

(async () => {
    const url = 'some url';
    const scrap = await KissanimeScrapper.scrap(url);
    if (scrap.success)
        console.log(scrap.data.hosters);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/kissanime-scrapper/docs/).
