import { Scrapper } from './Scrapper';

export interface IBaseScrap<T> {
    data?: T;
    url: string;
    scrapper: Scrapper<T>;
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
    public scrapper: Scrapper<T>;
    public success: boolean;
    public error?: Error;

    protected constructor({ data, url, scrapper, success, error }: IScrap<T>) {
        this.data = data;
        this.url = url;
        this.scrapper = scrapper;
        this.success = success;
        this.error = error;
    }
}
