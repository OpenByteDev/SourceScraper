# {{cp;name}} Scraper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScraper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScraper)
[![npm version](https://badge.fury.io/js/{{lc;name}}-scraper.svg)](https://www.npmjs.com/package/{{lc;name}}-scraper)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScraper/status.svg?path=packages%2F{{lc;name}}-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2F{{lc;name}}-scraper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScraper/dev-status.svg?path=packages%2F{{lc;name}}-scraper)](https://david-dm.org/OpenByteDev/SourceScraper?path=packages%2F{{lc;name}}-scraper&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

A scraper for [{{cp;name}}](https://www.{{lc;mainDomain}}/).

This package is part of the [SourceScraper-Project](https://github.com/OpenByteDev/SourceScraper).


## Getting Started
### Installation
```bash
$ npm i {{lc;name}}-scraper
```


### Usage

```js
const { {{cp;name}}Scraper } = require('{{lc;name}}-scraper');

(async () => {
    const url = 'some url';
    const scrap = await new {{cp;name}}Scraper().scrap(url);
    if (scrap.success)
        console.log(scrap.data.{{lc;type}}s);
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScraper/packages/{{lc;name}}-scraper/docs/).
