const typeOf = require('typeof');
const normalizeUrl = require('normalize-url');
const urlparser = require('urlparser');

require("./extensions.js");
const runners = require('./runners');

const ScrapperList = require('./ScrapperList.js');
const StreamScrapper = require('./StreamScrapper.js');
const LinkScrapper = require('./LinkScrapper.js');
const StreamInfo = require('./StreamInfo.js');
const HosterInfo = require('./HosterInfo.js');
const Source = require('./Source.js');
const Hoster = require('./Hoster.js');


const defaultScrappers = {
    dom: ({dom}) => {
        const info = new StreamInfo();
        const videos = dom.getElementsByTagName("video");
        for (let video of videos) {
            const vsrc = video.getAttribute("src");
            if (vsrc)
                info.source.push({
                    url: vsrc,
                    type: video.getAttribute("type")
                });
            const poster = video.getAttribute("poster");
            if (poster)
                info.poster = poster;
            const sources = video.getElementsByTagName("source");
            for (let source of sources) {
                const ssrc = source.getAttribute("src");
                if (ssrc)
                    info.source.push({
                        url: ssrc,
                        type: source.getAttribute("type")
                    });
            }
        }
        return info;
    },
    puppeteer: async ({page}) => {
        return await page.evaluate(scrapper => {
            return eval("(" + scrapper + ")")(document);
        }, defaultScrappers.dom.toString());
    }
};


const ex = {
    stream: new ScrapperList([
        new StreamScrapper({
            name: 'Openload',
            domain: ['openload.co', 'oload.tv'],
            runner: 'puppeteer',
            exec: async ({page}) => {
                let streamurl = await page.$eval('[id*=stream]', e => e.innerText);
                let title = await page.$eval('meta[name="description"], meta[name="og:title"], meta[name="twitter:title"]', e => e.content);
                let thumb = await page.$eval('meta[name="og:image"], meta[name="twitter:image"]', e => e.content);
                return new StreamInfo({
                    source: new Source({
                        url: `https://openload.co/stream/${await streamurl}?mime=true`
                    }),
                    title: title,
                    poster: thumb
                });
            }
        }),
        new StreamScrapper({
            name: 'Streamcloud',
            domain: 'streamcloud.eu',
            runner: 'url',
            exec: async ({url, runners}) => {
                const dataRegex = new RegExp(/\/([^\/.]+)\/(.*)\.[^.]+/, 'gi');
                const data = dataRegex.execAll(url);
                if (data.length <= 0 || data[0].length <= 2)
                    return null;
                const id = data[0][1];
                const name = data[0][2];
                if (!id || !name || !('puppeteer' in runners))
                    return null;

                const axios = require('axios');
                const queryString = require('query-string');
                const response = await axios.request({
                    url: url,
                    method: 'post',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0',
                        'Accept': '*/*',
                        'Referer': url,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cache-Control': 'no-cache',
                        'Connection': 'Keep-Alive'
                    },
                    data: queryString.stringify({
                        fname: name,
                        hash: '',
                        id: id,
                        op: 'download1',
                        referer: '',
                        usr_login: '',
                        imhuman: 'Weiter+zum+Video'
                    })
                });
                if (!response)
                    return null;

                const configRegex = new RegExp(/jwplayer\("[^"]+"\).setup\({(.*?)}\);/, 'i');
                const propRegex = new RegExp(/(\w+)\s*:\s*"?(.*?)"?\s*,/, 'ig');
                const newlineregex = /(?:\\n|\n)/g;
                const tabRegex = /(?:\\t|\t)/g;
                const html = response.data.replace(newlineregex, "");
                const configData = configRegex.exec(html);
                if (configData.length < 1)
                    return null;
                const configRAW = configData[1].replace(tabRegex, '');
                const propData = propRegex.execAll(configRAW);
                const props = {};
                for (let e of propData)
                    if (e && e.length >= 2)
                        props[e[1]] = e[2];
                return new StreamInfo({
                    poster: props.image,
                    title: name,
                    source: new Source({
                        url: props.file,
                        resolution: props.width + 'x' + props.height
                    })
                });
            }
        }),
        new StreamScrapper({
            name: 'Vidzi',
            domain: 'vidzi.tv',
            runner: 'puppeteer',
            exec: async ({page}) => {
                const config = await page.evaluate(() => jwplayer().getConfig().playlistItem);
                const title = await page.$eval('.video-title', t => t.innerText);
                return new StreamInfo({
                    poster: config.image,
                    title: title,
                    source: config.allSources.map(s => new Source({
                        url: s.file,
                        type: s.type
                    }))
                });
            }
        }),
        new StreamScrapper({
            name: 'Vidstreaming',
            domain: "vidstreaming.io",
            runner: 'html',
            exec: async ({html}) => {
                const titleregex = new RegExp(/<title>([^<]+)<\/title>/);
                const setupregex = new RegExp(/playerInstance\.setup\(\s*{\s*sources\s*:\s*\[\s*{\s*(.*?)\s*}\s*]\s*,?\s*}\s*\)\s*;/, "gi");
                const loadregex = new RegExp(/playerInstance\.load\(\s*{\s*(.*?)\s*,?\s*}\s*\)\s*;/, "gi");
                const newlineregex = /(?:\\n|\n)/g;

                html = html.replace(newlineregex, "");

                const setupjson =
                    "[" + setupregex
                        .execAll(html)
                        .map(match => match.length > 1 ? match[1] : null)
                        .filter(e => e !== null)
                        .map(s => s.replace(/'/g, "\""))
                        .map(s => s.replace(/(^|,|{)\s*(file|label|type)\s*:/g, "$1\"$2\":"))
                        .map(s => "{" + s + "}")
                        .reduce((a, c) => a + "," + c) + "]";
                const setupdata = JSON.parse(setupjson);
                const loadjson =
                    "[" + loadregex
                        .execAll(html)
                        .map(match => match.length > 1 ? match[1] : null)
                        .filter(e => e !== null)
                        .map(s => s.replace(/'/g, "\""))
                        .map(s => s.replace(/(^|,|{)\s*(file|label|type)\s*:/g, "$1\"$2\":"))
                        .map(s => "{" + s + "}")
                        .reduce((a, c) => a + "," + c) + "]";
                const loaddata = JSON.parse(loadjson);

                const src = setupdata.concat(loaddata)
                    .filter(e => "file" in e)
                    .map(e => {
                        e.url = e.file;
                        delete e.file;
                        return e;
                    });

                const title = titleregex.exec(html)[1];

                return new StreamInfo({
                    title: title,
                    source: new Source({
                        url: src
                    })
                });
            }
        }),
        /*new StreamScrapper({
            name: 'Estream',
            domain: 'estream.to',
            runner: 'puppeteer',
            exec: async page => {
                await page.waitForSelector(".flowplayer", {timeout: 10000});
                let player = await page.$('.flowplayer');
                await page.waitFor(1000);
                await player.click();
                await page.waitFor(1000);
                await player.click();
                await page.waitForSelector("video", {timeout: 10000});
                const clip = await page.evaluate(() => flowplayer().conf.clip);
                const info = {};
                if (clip.title)
                    info.title = clip.title;
                info.src = [];
                for (let s of clip.sources) {
                    s.url = s.src;
                    delete s.src;
                    info.src.push(s);
                }
                const activations = page.requests.map(r => r.url).filter(u => u.includes("estream.to/dl"));
                if (activations.length >= 1)
                    info.activation = activations[0];
                return info;
            }
        }),*/
        new StreamScrapper({
            name: 'Streamango',
            domain: 'streamango.com',
            runner: 'puppeteer',
            exec: async ({page}) => {
                let srcs = await page.evaluate(() => {
                    for (let script of document.getElementsByTagName("script")) {
                        if (script.src)
                            continue;
                        if (script.text.includes("srces.push")) {
                            eval(script.innerText);
                            return srces;
                        }
                    }
                });
                return new StreamInfo({
                    source: srcs.map(s => new Source({
                        url: s.src,
                        type: s.type,
                        resolution: s.height
                    }))
                });
            }
        }),
        new StreamScrapper({
            name: 'Rapidvideo',
            domain: 'rapidvideo.com',
            runner: 'dom',
            exec: (args={}) => defaultScrappers.dom(args)
        })
    ]),
    link: new ScrapperList([
        new LinkScrapper({
            name: 'Gogoanime',
            domain: 'gogoanime.io',
            runner: 'dom',
            exec: ({dom}) => {
                const containers = dom.getElementsByClassName('anime_muti_link'); //<-- no typo here
                if (!(containers.length >= 1))
                    return null;
                const container = containers[0];
                const items = container.getElementsByTagName('li');
                const hoster = [];
                for (let item of items) {
                    const links = item.getElementsByTagName('a');
                    if (!(links.length >= 1))
                        continue;
                    const link = links[0];
                    const url = link.getAttribute('data-video');
                    if (!url)
                        continue;
                    let name = link.textContent;
                    if (name) {
                        const spans = link.getElementsByTagName('span');
                        if (spans.length >= 1) {
                            const span = spans[0];
                            name = name.replace(span.textContent, "");
                        }
                    }
                    hoster.push({
                        url: url,
                        name: name.trim()
                    });
                }
                const titles = dom.getElementsByTagName('title');
                const info = new HosterInfo({
                    hoster: hoster.map(h => new Hoster({
                        url: h.url,
                        name: h.name
                    }))
                });
                if (titles.length >= 1)
                    info.title = titles[0].textContent;
                return info;
            }
        }),
        /*new LinkScrapper({
            name: 'BurningSeries',
            domain: 'bs.to',
            runner: 'dom',
            exec: async dom => {
                const hostertabs = dom.getElementsByClassName("hoster-tabs");
                if (!(hostertabs.length >= 1))
                    return null;
                const info = {hoster: []};
                const metas = dom.getElementsByTagName("meta");
                for (let meta of metas) {
                    const prop = meta.getAttribute("property");
                    if (!prop || prop !== "og:title")
                        continue;
                    const content = meta.getAttribute("content");
                    if (!content)
                        continue;
                    info.title = content;
                    break;
                }
                const bases = dom.getElementsByTagName("base");
                if (!(bases.length >= 1))
                    return null;
                const base = bases[0];
                const basehref = base.getAttribute("href");
                const items = hostertabs[0].getElementsByTagName("li");
                for (let item of items) {
                    const as = item.getElementsByTagName("a");
                    if (!(as.length >= 1))
                        continue;
                    const a = as[0];
                    let href = a.getAttribute("href");
                    const name = item.textContent;
                    if (!href)
                        continue;
                    href = normalizeUrl(basehref + href);

                    const outurl = await runners.dom(href, dom => {
                        const players = dom.getElementsByClassName("hoster-player");
                        if (!(players.length >= 1))
                            return null;
                        const player = players[0];
                        const outhref = player.getAttribute("href");
                        if (!outhref)
                            return null;
                        return normalizeUrl(outhref);
                    });
                    if (!outurl)
                        continue;
                    let url = await runners.puppeteer(outurl, async page => {
                        const captcha = await page.$("#recaptcha-anchor, div");
                        await captcha.focus();
                        await captcha.click();
                        let error = false;
                        await page.waitForNavigation({
                            timeout: 10000,
                            waitUwntil: "networkidle0"
                        }).catch(reason => error = true);
                        return error ? null : page.url();
                    });
                    console.log(url);
                    if (!url)
                        continue;
                    url = normalizeUrl(url);
                    info.hoster.push({name: name, url: url});
                }

                return info;
            }
        })*/
    ])
};

Object.defineProperties(ex, {
    all: {
        get: () =>
            new ScrapperList(
                [ex.stream, ex.link]
                    .filter(s => s instanceof ScrapperList)
                    .map(l => l.scrappers)
                    .reduce((a, e) => a.concat(e))
            ),
        enumerable: true
    },
    hosters: {
        get: () =>
            ex.all.scrappers.flatMap(e => e.domain),
        enumerable: true
    }
});

module.exports = ex;