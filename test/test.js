const { config, scrappers, SourceInfo, HosterInfo } = require('../dist/index.js');
const isTravisCiBuild = require('is-travis-ci-build');

(async () => {
    
    config.showError = true;
    config.puppeteer.headless = true;

    if (isTravisCiBuild())
        config.puppeteer.args = ['--no-sandbox'];

    const urls = [
        'https://oload.win/embed/3fz9J5E1aMg',
        // 'http://streamcloud.eu/dx008gqtcsdw/jumanji.SD-spectre.mkv.html', // test not working on travis ci
        'https://vidzi.tv/8yrmh5ooflp6.html',
        'https://vidstreaming.io/streaming.php?id=MzkzNTA=&title=Sword+Art+Online+Episode+6',
        'https://streamango.com/embed/klkflffksmotebqk/YuGiOhArcVEpisode123-rh-343_mp4',
        'https://rapidvideo.com/e/FO24ULAW2H',
        'https://stream.moe/embed2/902293eb0f33cd5b',
        'https://mp4upload.com/embed-w9hlxws8w3b6.html',

        'https://www3.gogoanime.se/death-note-episode-19',
        'https://www.masterani.me/anime/watch/2809-b-the-beginning/7',
        // 'http://kissanime.ru/Anime/Yu-Gi-Oh-Arc-V-Dub/Episode-123?id=142754&s=default' // test not working on travis ci
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
