# Source Scrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper) [![npm version](https://badge.fury.io/js/sourcescrapper.svg)](https://www.npmjs.com/package/sourcescrapper) 
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg)](https://david-dm.org/OpenByteDev/SourceScrapper)  [![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg)](https://david-dm.org/OpenByteDev/SourceScrapper?type=dev)  [![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT) [![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()

Simple library which helps you to retrieve...
 - the source of various video streaming sites
 - the urls to these streaming sites. 

<hr>

## Supported Sites

#### Source
 - <sub><img src="http://www.google.com/s2/favicons?domain=oload.win" height="20"></sub> Openload (openload.co, oload.tv, oload.win)
 - <sub><img src="http://www.google.com/s2/favicons?domain=streamcloud.eu" height="20"></sub> Streamcloud (streamcloud.eu)
 - <sub><img src="http://www.google.com/s2/favicons?domain=vidzi.tv" height="20"></sub> Vidzi (vidzi.tv)
 - <sub><img src="http://www.google.com/s2/favicons?domain=vidstreaming.io" height="20"></sub> Vidstreaming (vidstreaming.io)
 - <sub><img src="http://www.google.com/s2/favicons?domain=streamango.com" height="20"></sub> Streamango (streamango.com)
 - <sub><img src="http://www.google.com/s2/favicons?domain=rapidvideo.com" height="20"></sub> Rapidvideo (rapidvideo.com)
 - <sub><img src="http://www.google.com/s2/favicons?domain=stream.moe" height="20"></sub> StreamMoe (stream.moe)

#### Hoster
- <sub><img src="http://www.google.com/s2/favicons?domain=masterani.me" height="20"></sub> MasterAnime (masterani.me)
- <sub><img src="http://www.google.com/s2/favicons?domain=gogoanime.io" height="20"></sub> Gogoanime (gogoanime.io, gogoanime.se)
- <sub><img src="http://www.google.com/s2/favicons?domain=kissanime.ru" height="20"></sub> Kissanime (kissanime.ru)
<hr>

## Getting Started
### Installation
```bash
$ npm install sourcescrapper
```

### Usage
```js
const { scrappers } = require('sourcescrapper');

(async () => {
    const url = 'some url';
    const scrapper = scrappers.all.getFirstApplicable(url);
    const scrap = await scrapper.run(url);
    if (scrap.info && scrap.info.source.length > 0)
        console.log(scrap.info.source[0].url);
})();
```

### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/).
