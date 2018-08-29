import { SimpleJWPlayerScraper } from 'source-scraper-jwplayer-runner';

export class MP4UploadScraper extends SimpleJWPlayerScraper {
    public name: string = 'mp4upload';
    public domains: string[] = ['mp4upload.com'];
    public urlPattern: RegExp =
        /(?:(?:https?:)?\/\/)?(?:[^.]+\.)?mp4upload\.com\/embed-([a-zA-Z0-9]+)\.html/i;
}
