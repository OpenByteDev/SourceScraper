import { Configurable, IConfigurable, IOptions } from './Configurable';
import { IBaseScrap, IScrap, Scrap } from './Scrap';

export interface IScrapperData {
    name: string;
    domains: string[];
    urlPattern: RegExp;
}

export type IScrapperOptions = IOptions;

export interface IScrapper<T, SO extends IScrapperOptions = IScrapperOptions> extends IScrapperData, IConfigurable<SO> {
    scrap: (url: string, options?: SO) => Promise<IScrap<T>>;
}

export abstract class Scrapper<T, SO extends IScrapperOptions = IScrapperOptions>
    extends Configurable<SO> implements IScrapper<T, SO> {
    public abstract name: string;
    public abstract domains: string[];
    public abstract urlPattern: RegExp;

    public isApplicable(url: string): boolean {
        return this.urlPattern.test(url);
    }
    public isApplicableDomain(domain: string): boolean {
        return this.domains.some(d => d === domain);
    }
    public async scrap(url: string, options?: SO): Promise<Scrap<T>> {
        return this.getScrap(url, async () => this.exec(url, this.getOptions(options)));
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
    protected abstract async exec(url: string, options?: SO): Promise<T>;
}
