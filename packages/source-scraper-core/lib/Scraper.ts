import { Configurable, IConfigurable, IOptions } from './Configurable';
import { IBaseScrap, IScrap, Scrap } from './Scrap';

export interface IScraperData {
    name: string;
    domains: string[];
    urlPattern: RegExp;
}

export type IScraperOptions = IOptions;

export interface IScraper<T, SO extends IScraperOptions = IScraperOptions> extends IScraperData, IConfigurable<SO> {
    scrap: (url: string, options?: SO) => Promise<IScrap<T>>;
}

export abstract class Scraper<T, SO extends IScraperOptions = IScraperOptions>
    extends Configurable<SO> implements IScraper<T, SO> {
    public abstract name: string;
    public abstract domains: string[];
    public abstract urlPattern: RegExp;

    public isApplicable(url: string): boolean {
        return this.urlPattern.test(url);
    }
    public isApplicableDomain(domain: string): boolean {
        return this.domains.some(d => d === domain);
    }
    public getUrlData(url: string, throwIfNull: true): RegExpExecArray;
    public getUrlData(url: string, throwIfNull: false): RegExpExecArray | null;
    public getUrlData(url: string, throwIfNull: boolean = false): RegExpExecArray | null {
        const data = this.urlPattern.exec(url);
        if (throwIfNull && !Array.isArray(data))
            throw new Error('Unexpected url format');
        return data;
    }
    public async scrap(url: string, options?: SO): Promise<Scrap<T>> {
        return this.getScrap(url, async () => this.exec(url, this.getOptions(options)));
    }
    protected async getScrap(url: string, dataSupplier: () => Promise<T>): Promise<Scrap<T>> {
        const base: IBaseScrap<T> = {
            url,
            scraper: this
        };
        try {
            return Scrap.success({
                ...base,
                data: await dataSupplier()
            });
        } catch (error) {
            return Scrap.failure({
                ...base,
                error
            });
        }

    }
    protected abstract async exec(url: string, options: SO): Promise<T>;
}
