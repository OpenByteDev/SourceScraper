import { GogoanimeScrapper } from 'gogoanime-scrapper';
import { KissanimeScrapper } from 'kissanime-scrapper';
import { MasteranimeScrapper } from 'masteranime-scrapper';
import { MP4UploadScrapper } from 'mp4upload-scrapper';
import { OpenloadScrapper } from 'openload-scrapper';
import { RapidvideoScrapper } from 'rapidvideo-scrapper';
import { StreamangoScrapper } from 'streamango-scrapper';
import { StreamcloudScrapper } from 'streamcloud-scrapper';
import { StreamMoeScrapper } from 'streammoe-scrapper';
import { VidstreamingScrapper } from 'vidstreaming-scrapper';
import { VidziScrapper } from 'vidzi-scrapper';
import { IHosterData, ISourceData, Scrapper, ScrapperArray } from '../../sourcescrapper-core';

const source: Array<Scrapper<ISourceData>> = [
    new OpenloadScrapper(),
    new VidziScrapper(),
    new VidstreamingScrapper(),
    new StreamangoScrapper(),
    new RapidvideoScrapper(),
    new StreamMoeScrapper(),
    new MP4UploadScrapper(),
    new StreamcloudScrapper()
];

const hoster: Array<Scrapper<IHosterData>> = [
    new MasteranimeScrapper(),
    new GogoanimeScrapper(),
    new KissanimeScrapper()
];

export interface IScrappers {
    all: ScrapperArray<ISourceData | IHosterData>;
    source: ScrapperArray<ISourceData>;
    hoster: ScrapperArray<IHosterData>;
}

export const scrappers: IScrappers = {
    all: new ScrapperArray<ISourceData | IHosterData>(...[...source, ...hoster]),
    source: new ScrapperArray<ISourceData>(...source),
    hoster: new ScrapperArray<IHosterData>(...hoster)
};
