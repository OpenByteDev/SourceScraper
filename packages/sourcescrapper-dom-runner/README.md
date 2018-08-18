# SourceScrapper-DomRunner

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/sourcescrapper-dom-runner.svg)](https://www.npmjs.com/package/sourcescrapper-dom-runner)
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg?path=packages%2Fdom-runner)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fdom-runner)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg?path=packages%2Fdom-runner)](https://david-dm.org/OpenByteDev/SourceScrapper?path=packages%2Fdom-runner&type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

Provides the [DomRunner](https://openbytedev.github.io/SourceScrapper/packages/dom-runner/docs/classes/domrunner.html) class for scrapping.

This package is part of the [SourceScrapper-Project](https://github.com/OpenByteDev/SourceScrapper).


## Getting Started
### Installation
```bash
$ npm i sourcescrapper-dom-runner
```


### Usage

```js
const { DomRunner } = require('sourcescrapper-dom-runner');

(async () => {
    const url = 'some url';
    const data = await DomRunner.run(url, args => {
        // Extract data using args
    });
    // Do something with extracted data
})();
```


### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/packages/dom-runner/docs/).
