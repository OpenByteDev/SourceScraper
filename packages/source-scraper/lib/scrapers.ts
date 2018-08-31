import { IHosterData, ISourceData, ScraperArray } from 'source-scraper-core';

import { MP4UploadScraper } from 'mp4upload-scraper';
import { MyStreamScraper } from 'mystream-scraper';
import { OpenloadScraper } from 'openload-scraper';
import { RapidvideoScraper } from 'rapidvideo-scraper';
import { StreamangoScraper } from 'streamango-scraper';
import { StreamcloudScraper } from 'streamcloud-scraper';
import { StreamMoeScraper } from 'streammoe-scraper';
import { TiwikiwiScraper } from 'tiwikiwi-scraper';
import { VevioScraper } from 'vevio-scraper';
import { VidstreamingScraper } from 'vidstreaming-scraper';
import { VidziScraper } from 'vidzi-scraper';

import { GogoanimeScraper } from 'gogoanime-scraper';
import { KissanimeScraper } from 'kissanime-scraper';
import { MasteranimeScraper } from 'masteranime-scraper';

export const source = new ScraperArray<ISourceData>(
    new MP4UploadScraper(),
    new MyStreamScraper(),
    new OpenloadScraper(),
    new RapidvideoScraper(),
    new StreamangoScraper(),
    new StreamcloudScraper(),
    new StreamMoeScraper(),
    new TiwikiwiScraper(),
    new VevioScraper(),
    new VidstreamingScraper(),
    new VidziScraper()
);

export const hoster = new ScraperArray<IHosterData>(
    new MasteranimeScraper(),
    new GogoanimeScraper(),
    new KissanimeScraper()
);

export const all = new ScraperArray<ISourceData | IHosterData>(
    ...source,
    ...hoster
);
