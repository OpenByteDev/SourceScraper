const { config, scrappers, classes: { SourceInfo, HosterInfo } } = require('../dist/index.js');

(async () => {
    config.showError = true;

    config.puppeteer.headless = true;
    //config.puppeteer.executablePath = 'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe';
    config.puppeteer.args = ['--no-sandbox', '--disable-setuid-sandbox'];

    const urls = [
        'https://openload.co/embed/zRpmqpRRaac/YuGiOhArcVEpisode123-rh-480.x.mp4',
        'https://oload.tv/embed/fZOeAHeGgcI',
        'http://streamcloud.eu/dx008gqtcsdw/jumanji.SD-spectre.mkv.html',
        'https://vidzi.tv/8yrmh5ooflp6.html',
        'http://vidstreaming.io/streaming.php?id=NzUwMDI=&title=Mob+Psycho+100+Episode+9',
        'https://streamango.com/embed/klkflffksmotebqk/YuGiOhArcVEpisode123-rh-343_mp4',
        'https://rapidvideo.com/e/FO24ULAW2H',
        'https://stream.moe/embed2/902293eb0f33cd5b',

        'https://ww3.gogoanime.io/death-note-episode-19',
        'https://www.masterani.me/anime/watch/2809-b-the-beginning/7',
        'http://kissanime.ru/Anime/Yu-Gi-Oh-Arc-V-Dub/Episode-123?id=142754&s=default'
    ];

    let allSuccess = true;
    try {
        for (let url of urls) {
            const scrapper = scrappers.all.getFirstApplicable(url);
            const scrap = await scrapper.run(url);

            const success =
                scrap.info &&
                scrap.info instanceof SourceInfo && scrap.info.source.length > 0 ||
                scrap.info instanceof HosterInfo && scrap.info.hoster.length > 0;

            console.log(`${scrapper.name}: ${success}`);

            if (!success)
                allSuccess = false;
        }
    } catch (err) {
        allSuccess = false;
        if (config.showError)
            console.error(err);
        console.error('Unexpected error during testing');
    }
    if (!allSuccess)
        process.exit(1);
    process.exit(0);
})();
