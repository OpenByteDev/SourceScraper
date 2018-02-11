const normalizeUrl = require('normalize-url');
const urlparser = require('urlparser');
const removeNewline = require('newline-remove');
const queryString = require('query-string');
const random = require('random-number');

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
            const vsrc = video.attrs["src"];
            if (vsrc)
                info.source.push(new Source({
                    url: vsrc,
                    type: video.attrs["type"]
                }));
            const poster = video.attrs["poster"];
            if (poster)
                info.poster = poster;
            const sources = video.getElementsByTagName("source");
            for (let source of sources) {
                const ssrc = source.attrs["src"];
                if (ssrc)
                    info.source.push(new Source({
                        url: ssrc,
                        type: source.attrs["type"]
                    }));
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

                const html = await runners.html.run({
                    url: url,
                    scrapper: ({html}) => removeNewline(html),
                    options: {
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
                            id: id,
                            op: 'download1',
                            referer: '',
                            usr_login: '',
                            imhuman: 'Weiter+zum+Video'
                        })
                    }
                });

                const configRegex = new RegExp(/jwplayer\("[^"]+"\).setup\({(.*?)}\);/, 'i');
                const propRegex = new RegExp(/(\w+)\s*:\s*"?(.*?)"?\s*,/, 'ig');
                const tabRegex = /(?:\\t|\t)/g;
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

                html = removeNewline(html);

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
                const bodys = dom.getElementsByTagName('body');
                if (!(bodys.length >= 1))
                    return null;
                const body = bodys[0];
                const containers = body.getElementsByClassName('anime_muti_link'); //<-- no typo here
                if (!(containers.length >= 1))
                    return null;
                const container = containers[0];
                const items = container.getElementsByTagName('li');
                const info = new HosterInfo();
                for (let item of items) {
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
                            name = name.replace(span.textContent, "");
                        }
                    }
                    info.hoster.push(new Hoster({
                        url: url,
                        name: name.trim()
                    }));
                }
                const titles = dom.getElementsByTagName('title');
                if (titles.length >= 1)
                    info.title = titles[0].getText();
                return info;
            }
        }),
        new LinkScrapper({
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
                            //||
                            //url.includes('2mdnsys.com') ||
                            //url.includes('ti553.com')
                    }
                }
            },
            exec: async ({page, url}) => {
                const gotoIfNotTarget = async page => {
                    if (normalizeUrl(page.url()) !== normalizeUrl(url))
                        await page.goto(url, {
                            waitUntil: 'domcontentloaded'
                        });
                };
                await page.waitForNavigation({
                    waitUntil: 'domcontentloaded'
                });
                await gotoIfNotTarget(page);
                //await page.waitForSelector('#formVerify img');

                while (page.url().toLowerCase().includes('special/areyouhuman2?reurl')) {
                    let verifyOptions = await page.$$('#formVerify img');
                    let r = random.generator({
                        min: 0,
                        max: verifyOptions.length-1,
                        integer: true
                    });
                    let r1 = r();
                    let r2;
                    do r2 = r();
                    while (r1 === r2);

                    await verifyOptions[r1].click();
                    await verifyOptions[r2].click();

                    let response = await page.waitForNavigation({
                        waitUntil: 'domcontentloaded'
                    });

                    if (response.status() === 500)
                        await page.goto(url, {
                            waitUntil: 'domcontentloaded'
                        });

                    if (page.url().toLowerCase().includes('special/areyouhuman2') && (await page.$eval('body', body => body.innerText)).startsWith('Wrong')) {
                        const link = await page.$('a');
                        await link.click();
                        await page.waitForSelector('#formVerify img');
                    }
                }
                await gotoIfNotTarget(page);

                const waitAndGetVideoFrameSource = async page => {
                    await page.waitForSelector('#divContentVideo iframe');
                    return await page.$eval('#divContentVideo iframe', frame => frame.src);
                };
                const defaultUrl = await waitAndGetVideoFrameSource(page);

                const hosterOptionsHandles = await page.$$('#selectServer option');
                const hosterOptions = [];

                const info = new HosterInfo();

                for (let hosterHandle of hosterOptionsHandles)
                    hosterOptions.push({
                        name: await (await hosterHandle.getProperty('innerText')).jsonValue(),
                        url: await (await hosterHandle.getProperty('value')).jsonValue(),
                        default: await (await hosterHandle.getProperty('selected')).jsonValue()
                    });

                const u = urlparser.parse(url);
                const baseUrl = `${u.host.protocol}://${u.host.hostname}`;
                for (let hoster of hosterOptions) {
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
        /*new LinkScrapper({
            name: 'Kissanime',
            domain: 'kissanime.ru',
            runner: 'dom',
            runnerOptions: {
                axios: {
                    config: {
                        validateStatus: status =>
                            status >= 200 && status < 300 || status === 503
                    }
                }
            },
            exec: async ({dom, url, response}) => {
                const challengeForm = dom.getElementById('challenge-form');
                if (!challengeForm)
                    return null;
                const rawScript = dom.getElementsByTagName('script')[0].getText();
                const script = removeNewline(rawScript);
                const timeoutRegex = new RegExp(/setTimeout\(.*?{(.*)}.*?\)/);
                const [ , timeoutContent ] = timeoutRegex.exec(script);
                if (!timeoutContent)
                    return null;

                const answerName = 'jschl-answer';
                const dataRegex = new RegExp(`s,t,o,p,b,r,e,a,k,i,n,g,f,\\s?(\\w+?)\\s?=\\s?{['"](\\w+?)['"]:(.+?)};.*?(\\w+?)\\s?=\\s?document\\.getElementById\\('${answerName}'\\);.*?(\\1.*)\\4\.value\\s?=\\s?(.+?);`, 'i');
                const [ , random_obj_name, random_prop_name, init_val, , mutationString, final_mutation ] = dataRegex.exec(timeoutContent);
                let answer = eval(init_val);
                const mutationsRegex = new RegExp(`${random_obj_name}\\.${random_prop_name}\\s?(.)=\\s?(.+?);`, 'gi');
                const mutations = mutationsRegex.execAll(mutationString);

                for (let [ , operator, value ] of mutations)
                    answer = eval(`answer ${operator} ${value}`);

                const u = urlparser.parse(url);
                const final_mutation_modded = final_mutation
                    .replace(random_obj_name + '.' + random_prop_name, answer)
                    .replace(/\w\.length/, u.host.hostname.length);
                answer = eval(final_mutation_modded);

                const params = {};
                for (let { attrs: { name, value, id } } of challengeForm.children)
                    params[name] = name === answerName || id === answerName ? answer : value;

                const actionUrl = `${u.host.protocol}://${u.host.hostname}${challengeForm.attrs.action || ''}`;

                const getCookies = response =>
                    response && response.headers && response.headers['set-cookie'] ? response.headers['set-cookie'].map(c => c.substring(0, c.indexOf(';'))).reduce((a, b) => a + '; ' + b) : '';
                let verificationCookies = getCookies(response);

                await sleep(6000);

                const { response: vresponse } = await runners.html.run({
                    url: actionUrl,
                    scrapper: data => data,
                    options: {
                        axios: {
                            config: {
                                params: params,
                                headers: {
                                    'Cookie': verificationCookies,
                                    'Referer': url
                                },
                                maxRedirects: 0,
                                validateStatus: status =>
                                   status >= 200 && status < 300 || status === 302
                            }
                        }
                    }
                });

                verificationCookies += '; ' + getCookies(vresponse);

                const { response: response2 } = await runners.html.run({
                    url: vresponse.headers.location,
                    scrapper: data => data,
                    options: {
                        axios: {
                            config: {
                                headers: {
                                    'Cookie': verificationCookies,
                                    'Referer': actionUrl
                                }
                            }
                        }
                    }
                });
                verificationCookies += '; ' + getCookies(response2);

                const cu = urlparser.parse(response2.request.res.responseUrl);

                const cparam = cu.query.params;
                cparam.reUrl = urldecode(cparam.reUrl);

                const captchacheckurl = `${cu.host.protocol}://${cu.host.hostname}/${cu.path.base}`;

                let cadata;
                const rgen = random.generator({
                    min: 0,
                    max: 3,
                    integer: true
                });
                do {
                    let r1 = rgen();
                    let r2;
                    do r2 = rgen();
                    while (r1 === r2);

                    cparam.answerCap = `${r1},${r2},`;
                    console.log(cparam);
                    cadata = (await runners.dom.run({
                        url: captchacheckurl,
                        scrapper: data => data,
                        options: {
                            axios: {
                                config: {
                                    method: 'post',
                                    params: queryString.stringify(cparam),
                                    data: queryString.stringify(cparam),
                                    headers: {
                                        'Cookie': verificationCookies,
                                        'Referer': cadata ? cadata.response.request.res.responseUrl : vresponse.headers.location,
                                        'Cache-Control': 'no-cache',
                                        'Pragma': 'no-cache'
                                    }
                                }
                            }
                        }
                    }));
                    await sleep(500);
                } while(cadata.html.startsWith('Wrong'));

                const info = new StreamInfo();
                const streamUrlRegex = new RegExp(/(?:\$|JQuery)\((["'])#divContentVideo\1\)\.html\(.*?src=(["'])(.*?)\2.*?\);/, 'i');

                const { html: cahtml, dom: cadom } = removeNewline(cadata.html);

                const erg = streamUrlRegex.exec(cahtml);

                console.log(erg);
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