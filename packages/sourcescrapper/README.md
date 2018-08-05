# SourceScrapper

[![Build Status](https://travis-ci.org/OpenByteDev/SourceScrapper.svg?branch=master)](https://travis-ci.org/OpenByteDev/SourceScrapper)
[![npm version](https://badge.fury.io/js/sourcescrapper.svg)](https://www.npmjs.com/package/sourcescrapper) 
[![Dependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/status.svg)](https://david-dm.org/OpenByteDev/SourceScrapper)
[![DevDependency Status](https://david-dm.org/OpenByteDev/SourceScrapper/dev-status.svg)](https://david-dm.org/OpenByteDev/SourceScrapper?type=dev)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)
[![Doge](https://img.shields.io/badge/doge-wow-yellow.svg)]()
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Scrap the sources from your favorite video streaming sites.

<hr>

## Supported Sites

#### Source
 - <sub><img src="http://www.google.com/s2/favicons?domain=oload.win" height="20"></sub> [Openload](https://www.openload.co)
 - <sub><img src="http://www.google.com/s2/favicons?domain=vidzi.tv" height="20"></sub> [Vidzi](https://www.vidzi.tv)
 - <sub><img src="http://www.google.com/s2/favicons?domain=vidstreaming.io" height="20"></sub> [Vidstreaming](https://www.vidstreaming.io)
 - <sub><img src="http://www.google.com/s2/favicons?domain=streamango.com" height="20"></sub> [Streamango](https://www.streamango.com)
 - <sub><img src="http://www.google.com/s2/favicons?domain=rapidvideo.com" height="20"></sub> [Rapidvideo](https://www.rapidvideo.com)
 - <sub><img src="http://www.google.com/s2/favicons?domain=stream.moe" height="20"></sub> [StreamMoe](https://www.stream.moe)
 - <sub><img src="http://www.google.com/s2/favicons?domain=mp4upload.com" height="20"></sub> [MP4Upload](https://www.mp4upload.com)
 - <sub><img src="http://www.google.com/s2/favicons?domain=streamcloud.eu" height="20"></sub> [Streamcloud](https://www.streamcloud.eu) <sub><img src="https://i.imgur.com/Hm8dCCN.png" height="20"></sub>

#### Hoster
- <sub><img src="http://www.google.com/s2/favicons?domain=masterani.me" height="20"></sub> [MasterAnime](https://www.masterani.me)
- <sub><img src="http://www.google.com/s2/favicons?domain=gogoanime.io" height="20"></sub> [Gogoanime](https://www.gogoanime.io)
- <sub><img src="http://www.google.com/s2/favicons?domain=kissanime.ru" height="20"></sub> [Kissanime](https://www.kissanime.ru) <sub><img src="https://i.imgur.com/Hm8dCCN.png" height="20"></sub>
<hr>

## Getting Started
### Installation
```bash
$ npm i sourcescrapper
```
There is a packages available for each site individually which you can find [here](./packages.md).

### Usage
```js
const { scrappers } = require('sourcescrapper');

(async () => {
    const url = 'some url';
    const scrapper = scrappers.getFirstApplicable(url);
    const scrap = await scrapper.scrap(url);
    if (scrap.success)
        console.log(scrap.data.sources[0].url);
})();
```

### API
The API generated with [TypeDoc](http://typedoc.org/) can be found [here](https://openbytedev.github.io/SourceScrapper/).
