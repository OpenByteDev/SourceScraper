# Source Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper) [![npm version](https://badge.fury.io/js/sourcescrapper.svg)](https://www.npmjs.com/package/sourcescrapper) 
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper.svg)](https://david-dm.org/OpenByteDev/SourceScrapper)  [![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT) [![DOGE](https://img.shields.io/badge/doge-wow-yellow.svg)]()

Simple library which helps you to retrieve...

 - the source of various video streaming sites

 - the urls to these streaming sites. 


<hr>

## Supported Sites

#### Stream
 - <sub><img src="http://www.google.com/s2/favicons?domain=openload.co" height="20" style="margin-bottom: -5px"></sub> openload.co
 - <sub><img src="http://www.google.com/s2/favicons?domain=oload.tv" height="20" style="margin-bottom: -5px"></sub> oload.tv
 - <sub><img src="http://www.google.com/s2/favicons?domain=streamcloud.eu" height="20" style="margin-bottom: -5px"></sub> streamcloud.eu
 - <sub><img src="http://www.google.com/s2/favicons?domain=vidzi.tv" height="20" style="margin-bottom: -5px"></sub> vidzi.tv
 - <sub><img src="http://www.google.com/s2/favicons?domain=vidstreaming.io" height="20" style="margin-bottom: -5px"></sub> vidstreaming.io
 - <sub><img src="http://www.google.com/s2/favicons?domain=streamango.com" height="20" style="margin-bottom: -5px"></sub> streamango.com

#### Link
- <sub><img src="http://www.google.com/s2/favicons?domain=gogoanime.io" height="20" style="margin-bottom: -5px"></sub> gogoanime.io

<hr>

## Getting Started
### Installation
```bash
npm install sourcescrapper
```

### Usage
```js
const {scrappers} = require('sourcescrapper');

(async () => {
    const url = 'some url';
    const scrapper = scrappers.all.getFirstApplicable(url);
    const scrap = await scrapper.run(url);
    if (scrap.info && scrap.info.source.length > 0)
        console.log(scrap.info.source[0].url);
})();
```
