import { HosterInfo } from './HosterInfo';
import { Runner } from './Runner';
import { Scrapper } from './Scrapper';

export type HosterScrapperExec = (args: any) => HosterInfo | Promise<HosterInfo | null> | null;

export class HosterScrapper extends Scrapper {
    constructor({ name, domain, runner, runnerOptions= {}, exec }:
                    { name: string, domain?: string[] | string, runner: Runner | string, runnerOptions?: any, exec: HosterScrapperExec }) {
        super({
            name,
            type: 'link',
            domain,
            runner,
            runnerOptions,
            exec
        });
    }
}
