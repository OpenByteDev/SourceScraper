import { Scraper } from './Scraper';

export interface IBaseScrap<T> {
    data?: T;
    url: string;
    scraper: Scraper<T>;
    error?: Error;
}

export interface IScrap<T> extends IBaseScrap<T> {
    success: boolean;
}

export interface ISuccessScrap<T> extends IBaseScrap<T> {
    data: T;
}

export interface IFailureScrap<T> extends IBaseScrap<T> {
    error: Error;
}

export class Scrap<T> implements IScrap<T> {
    public static success<T>(scrap: ISuccessScrap<T>): Scrap<T> {
        return new Scrap<T>({ ...scrap, success: true });
    }
    public static failure<T>(scrap: IFailureScrap<T>): Scrap<T> {
        return new Scrap({ ...scrap, success: false });
    }
    public data?: T;
    public url: string;
    public scraper: Scraper<T>;
    public success: boolean;
    public error?: Error;

    protected constructor({ data, url, scraper, success, error }: IScrap<T>) {
        this.data = data;
        this.url = url;
        this.scraper = scraper;
        this.success = success;
        this.error = error;
    }
}
