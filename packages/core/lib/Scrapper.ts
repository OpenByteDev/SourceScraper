import { IBaseScrap, IScrap, Scrap } from './Scrap';

export interface IScrapperData {
    name: string;
    domains: string[];
    urlPattern: RegExp;
}

export interface IScrapper<T> extends IScrapperData {
    scrap: (url: string) => Promise<IScrap<T>>;
}

export abstract class Scrapper<T> implements IScrapper<T> {
    public abstract name: string;
    public abstract domains: string[];
    public abstract urlPattern: RegExp;

    public isApplicable(url: string): boolean {
        return this.urlPattern.test(url);
    }
    public isApplicableDomain(domain: string): boolean {
        return this.domains.some(d => d === domain);
    }
    public async scrap(url: string): Promise<Scrap<T>> {
        return this.getScrap(url, async () => this.run(url));
    }
    protected async getScrap(url: string, dataSupplier: () => Promise<T>): Promise<Scrap<T>> {
        const base: IBaseScrap<T> = {
            url,
            scrapper: this
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
    protected abstract async run(url: string): Promise<T>;
}
