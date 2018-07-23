import { IBaseScrap, Scrap } from './Scrap';

export interface IScrapper {
    name: string;
    domains: string[];
    urlPattern: RegExp;
}
export abstract class Scrapper<T> implements IScrapper {
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
        const base: IBaseScrap<T> = {
            url,
            scrapper: this
        };
        try {
            return Scrap.success({
                ...base,
                data: await this.run(url)
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
