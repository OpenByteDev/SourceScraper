import { GogoanimeScraper } from 'gogoanime-scraper';
import { KissanimeScraper } from 'kissanime-scraper';
import { MasteranimeScraper } from 'masteranime-scraper';
import { MP4UploadScraper } from 'mp4upload-scraper';
import { MyStreamScraper } from 'mystream-scraper';
import { OpenloadScraper } from 'openload-scraper';
import { RapidvideoScraper } from 'rapidvideo-scraper';
import { IHosterData, ISourceData, Scraper, ScraperArray } from 'source-scraper-core';
import { StreamangoScraper } from 'streamango-scraper';
import { StreamcloudScraper } from 'streamcloud-scraper';
import { StreamMoeScraper } from 'streammoe-scraper';
import { VidstreamingScraper } from 'vidstreaming-scraper';
import { VidziScraper } from 'vidzi-scraper';

const source: Array<Scraper<ISourceData>> = [
    new OpenloadScraper(),
    new VidziScraper(),
    new VidstreamingScraper(),
    new StreamangoScraper(),
    new RapidvideoScraper(),
    new StreamMoeScraper(),
    new MP4UploadScraper(),
    new MyStreamScraper(),
    new StreamcloudScraper()
];

const hoster: Array<Scraper<IHosterData>> = [
    new MasteranimeScraper(),
    new GogoanimeScraper(),
    new KissanimeScraper()
];

export = {
    all: new ScraperArray<ISourceData | IHosterData>(...[...source, ...hoster]),
    source: new ScraperArray<ISourceData>(...source),
    hoster: new ScraperArray<IHosterData>(...hoster)
};
