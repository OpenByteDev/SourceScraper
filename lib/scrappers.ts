import removeNewline = require('newline-remove');
import normalizeUrl = require('normalize-url');
import queryString = require('query-string');
import random = require('random-number');
import typeOf = require('typeof');
import urlparser = require('urlparser');

import { Hoster } from './Hoster';
import { HosterInfo } from './HosterInfo';
import { HosterScrapper } from './HosterScrapper';
import { Runner } from './Runner';
import { Scrapper } from './Scrapper';
import { ScrapperList } from './ScrapperList';
import { Source } from './Source';
import { SourceInfo } from './SourceInfo';
import { SourceScrapper } from './SourceScrapper';

const defaultScrappers = new ScrapperList(
    new SourceScrapper({
        name: 'dom',
        runner: 'dom',
        exec: ({dom}) => {
            const info = new SourceInfo();
            const videos = dom.getElementsByTagName('video');
            for (const video of videos) {
                const vsrc = video.attrs.src;
                if (vsrc)
                    info.source.push(new Source({
                        url: vsrc,
                        type: video.attrs.type
                    }));
                const poster = video.attrs.poster;
                if (poster)
                    info.poster = poster;
                const sources = video.getElementsByTagName('source');
                for (const source of sources) {
                    const ssrc = source.attrs.src;
                    if (ssrc)
                        info.source.push(new Source({
                            url: ssrc,
                            type: source.attrs.type
                        }));
                }
            }
            return info;
        }
    }),
    new SourceScrapper({
        name: 'puppeteer',
        runner: 'puppeteer',
        exec: async ({page}) => {
            return page.evaluate((scrapper) => {
                return eval('(' + scrapper + ')')(document);
            }, defaultScrappers.getByName('dom').toString());
        }
    })
);

export const scrappers = {
    stream: new ScrapperList(
        new SourceScrapper({
            name: 'Openload',
            domain: ['openload.co', 'oload.tv'],
            runner: 'puppeteer',
            exec: async ({page}) => {
                const streamurl = await page.$eval(
                    '[id*=stream]',
                    (e) => e.innerText);
                const title = await page.$eval(
                    'meta[name="description"], meta[name="og:title"], meta[name="twitter:title"]',
                    (e) => e.content);
                const thumb = await page.$eval(
                    'meta[name="og:image"], meta[name="twitter:image"]',
                    (e) => e.content);
                return new SourceInfo({
                    source: new Source({
                        url: `https://openload.co/stream/${await streamurl}?mime=true`
                    }),
                    title,
                    poster: thumb
                });
            }
        }),
        new SourceScrapper({
            name: 'Streamcloud',
            domain: 'streamcloud.eu',
            runner: 'url',
            exec: async ({url, runners}) => {
                const dataRegex = new RegExp(/\/([^\/.]+)\/(.*)\.[^.]+/, 'i');
                const data = dataRegex.exec(url);
                if (data === null || data.length <= 2)
                    return null;
                const id = data[1];
                const name = data[2];
                if (!id || !name)
                    return null;

                const htmlRunner = runners.getByType('html');
                if (!(htmlRunner instanceof Runner))
                    return null;
                const html = await htmlRunner.run({
                    url,
                    scrapper: ({html: _html}) => removeNewline(_html),
                    options: {
                        axios: {
                            config: {
                                method: 'post',
                                headers: {
                                    'Referer': url,
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Cache-Control': 'no-cache',
                                    'Connection': 'Keep-Alive'
                                },
                                data: queryString.stringify({
                                    fname: name,
                                    hash: '',
                                    id,
                                    op: 'download1',
                                    referer: '',
                                    usr_login: '',
                                    imhuman: 'Weiter+zum+Video'
                                })
                            }
                        }
                    }
                }) as string;

                const configRegex = new RegExp(/jwplayer\("[^"]+"\).setup\({(.*?)}\);/, 'i');
                const propRegex = new RegExp(/(\w+)\s*:\s*"?(.*?)"?\s*,/, 'ig');
                const tabRegex = /(?:\\t|\t)/g;
                const configData = configRegex.exec(html);
                if (!configData || configData.length < 1)
                    return null;
                const configRAW = configData[1].replace(tabRegex, '');
                const propData = propRegex.execAll(configRAW);
                const props: any = {};
                for (const e of propData)
                    if (e && e.length >= 2)
                        props[e[1]] = e[2];
                return new SourceInfo({
                    poster: props.image,
                    title: name,
                    source: new Source({
                        url: props.file,
                        resolution: props.width + 'x' + props.height
                    })
                });
            }
        }),
        new SourceScrapper({
            name: 'Vidzi',
            domain: 'vidzi.tv',
            runner: 'puppeteer',
            exec: async ({page}) => {
                // tslint:disable-next-line
                let jwplayer; // remove typescript error "cannot find name 'jwplayer'"
                const config = await page.evaluate(() => jwplayer().getConfig().playlistItem);
                const title = await page.$eval('.video-title', (t) => t.innerText);
                return new SourceInfo({
                    poster: config.image,
                    title,
                    source: config.allSources.map((s) => new Source({
                        url: s.file,
                        type: s.type
                    }))
                });
            }
        }),
        new SourceScrapper({
            name: 'Vidstreaming',
            domain: 'vidstreaming.io',
            runner: 'html',
            exec: async ({html}) => {
                const titleregex =
                    new RegExp(/<title>([^<]+)<\/title>/);
                const setupregex =
                    new RegExp(/playerInstance\.setup\({\s*sources\s*:\s*\[\s*{\s*(.*?)\s*}\s*]\s*,?\s*}\);/, 'gi');
                const loadregex =
                    new RegExp(/playerInstance\.load\({\s*(.*?)\s*,?\s*}\)\s*;/, 'gi');

                html = removeNewline(html);

                const setupjson =
                    '[' + setupregex
                        .execAll(html)
                        .map((match) => match.length > 1 ? match[1] : null)
                        .filter((e) => e !== null)
                        .map((s) => s.replace(/'/g, '"'))
                        .map((s) => s.replace(/(^|,|{)\s*(file|label|type)\s*:/g, '$1"$2":'))
                        .map((s) => '{' + s + '}')
                        .reduce((a, c) => a + ',' + c) + ']';
                const setupdata = JSON.parse(setupjson);
                const loadjson =
                    '[' + loadregex
                        .execAll(html)
                        .map((match) => match.length > 1 ? match[1] : null)
                        .filter((e) => e !== null)
                        .map((s) => s.replace(/'/g, '"'))
                        .map((s) => s.replace(/(^|,|{)\s*(file|label|type)\s*:/g, '$1"$2":'))
                        .map((s) => '{' + s + '}')
                        .reduce((a, c) => a + ',' + c) + ']';
                const loaddata = JSON.parse(loadjson);

                const srcdata = setupdata.concat(loaddata)
                    .filter((e) => typeOf(e.file) === 'string' && !e.file.includes('error.com'));

                const titles = titleregex.exec(html);
                const title = titles !== null && titles.length >= 1 ? titles[0] : undefined;

                return new SourceInfo({
                    title,
                    source: srcdata.map((e) => new Source({
                        url: e.file
                    }))
                });
            }
        }),
        new SourceScrapper({
            name: 'Streamango',
            domain: 'streamango.com',
            runner: 'puppeteer',
            exec: async ({page}) => {
                // tslint:disable-next-line
                let srces; // remove typescript error "cannot find name 'srces'"
                const srcs = await page.evaluate(() => {
                    for (const script of document.getElementsByTagName('script')) {
                        if (script.src)
                            continue;
                        if (script.text.includes('srces.push')) {
                            eval(script.innerText);
                            return srces;
                        }
                    }
                });
                return new SourceInfo({
                    source: srcs.map((s) => new Source({
                        url: s.src,
                        type: s.type,
                        resolution: s.height
                    }))
                });
            }
        }),
        new SourceScrapper({
            name: 'Rapidvideo',
            domain: 'rapidvideo.com',
            runner: 'dom',
            exec: (args= {}) => defaultScrappers.getByName('dom').exec(args)
        })
    ),
    hoster: new ScrapperList(
        new HosterScrapper({
            name: 'Gogoanime',
            domain: 'gogoanime.io',
            runner: 'dom',
            exec: ({dom}) => {
                const bodys = dom.getElementsByTagName('body');
                if (!(bodys.length >= 1))
                    return null;
                const body = bodys[0];
                const containers = body.getElementsByClassName('anime_muti_link'); // <-- no typo here
                if (!(containers.length >= 1))
                    return null;
                const container = containers[0];
                const items = container.getElementsByTagName('li');
                const info = new HosterInfo();
                for (const item of items) {
                    const links = item.getElementsByTagName('a');
                    if (!(links.length >= 1))
                        continue;
                    const link = links[0];
                    const url = link.attrs['data-video'];
                    if (!url)
                        continue;
                    let name = link.getText();
                    if (name) {
                        const spans = link.getElementsByTagName('span');
                        if (spans.length >= 1) {
                            const span = spans[0];
                            name = name.replace(span.textContent, '');
                        }
                    }
                    info.hoster.push(new Hoster({
                        url,
                        name: name.trim()
                    }));
                }
                const titles = dom.getElementsByTagName('title');
                if (titles.length >= 1)
                    info.title = titles[0].getText();
                return info;
            }
        }),
        new HosterScrapper({
            name: 'Kissanime',
            domain: 'kissanime.ru',
            runner: 'puppeteer',
            runnerOptions: {
                puppeteer: {
                    requestInterception: {
                        active: true,
                        block: ({url, resourceType}) =>
                            !url.includes('kissanime.ru') ||
                            resourceType === 'image' ||
                            resourceType === 'font' ||
                            resourceType === 'stylesheet'
                        // ||
                        // url.includes('2mdnsys.com') ||
                        // url.includes('ti553.com')
                    }
                }
            },
            exec: async ({page, url}) => {
                const gotoIfNotTarget = async (_page) => {
                    if (normalizeUrl(_page.url()) !== normalizeUrl(url)) {
                        await _page.goto(url, {
                            waitUntil: 'domcontentloaded'
                        });
                    }
                };
                await page.waitForNavigation({
                    waitUntil: 'domcontentloaded'
                });
                await gotoIfNotTarget(page);
// await page.waitForSelector('#formVerify img');

                while (page.url().toLowerCase().includes('special/areyouhuman2?reurl')) {
                    const verifyOptions = await page.$$('#formVerify img');
                    const r = random.generator({
                        min: 0,
                        max: verifyOptions.length - 1,
                        integer: true
                    });
                    const r1 = r();
                    let r2;
                    do { r2 = r(); }
                    while (r1 === r2);

                    await verifyOptions[r1].click();
                    await verifyOptions[r2].click();

                    const response = await page.waitForNavigation({
                        waitUntil: 'domcontentloaded'
                    });

                    if (response.status() === 500)
                        await page.goto(url, {
                            waitUntil: 'domcontentloaded'
                        });

                    if (page.url().toLowerCase().includes('special/areyouhuman2') &&
                        (await page.$eval('body', (body) => body.innerText)).startsWith('Wrong')) {
                        const link = await page.$('a');
                        await link.click();
                        await page.waitForSelector('#formVerify img');
                    }
                }
                await gotoIfNotTarget(page);

                const waitAndGetVideoFrameSource = async (_page) => {
                    await _page.waitForSelector('#divContentVideo iframe');
                    return _page.$eval('#divContentVideo iframe', (frame) => frame.src);
                };
                const defaultUrl = await waitAndGetVideoFrameSource(page);

                const hosterOptionsHandles = await page.$$('#selectServer option');
                const hosterOptions: Array<{ name: string, url: string, default: boolean }> = [];

                const info = new HosterInfo();

                for (const hosterHandle of hosterOptionsHandles)
                    hosterOptions.push({
                        name: await (await hosterHandle.getProperty('innerText')).jsonValue(),
                        url: await (await hosterHandle.getProperty('value')).jsonValue(),
                        default: await (await hosterHandle.getProperty('selected')).jsonValue()
                    });

                const u = urlparser.parse(url);
                const baseUrl = `${u.host.protocol}://${u.host.hostname}`;
                for (const hoster of hosterOptions) {
                    if (hoster.name.toLowerCase() === 'beta server')
                        continue;
                    if (hoster.default) {
                        info.hoster.push(new Hoster({
                            name: hoster.name,
                            url: defaultUrl
                        }));
                        continue;
                    }
                    await page.goto(baseUrl + hoster.url, {
                        waitUntil: 'domcontentloaded'
                    });
                    info.hoster.push(new Hoster({
                        name: hoster.name,
                        url: await waitAndGetVideoFrameSource(page)
                    }));
                }

                return info;
            }
        })
    )
};

function all(): ScrapperList {
    return new ScrapperList(...[scrappers.stream, scrappers.hoster]
        .map((e) => e as Scrapper[])
        .reduce((a, e) => a.concat(e))
    );
}

Object.defineProperties(scrappers, {
    all: {
        get: (): ScrapperList => all(),
        enumerable: true
    },
    hosters: {
        get: (): string[] => all().hosters,
        enumerable: true
    },
    default: {
        value: defaultScrappers,
        enumerable: true,
        writable: false
    }
});
