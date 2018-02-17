import { Runner } from './Runner';
import { Scrapper } from './Scrapper';
import { SourceInfo } from './SourceInfo';

export type SourceScrapperExec = (args: any) => SourceInfo | Promise<SourceInfo | null> | null;

export class SourceScrapper extends Scrapper {
    constructor({ name, domain, runner, runnerOptions, exec }: {
        name: string,
        domain?: string[] | string,
        runner: Runner | string,
        runnerOptions?: any,
        exec: SourceScrapperExec
    }) {
        super({
            name,
            type: 'source',
            domain,
            runner,
            runnerOptions,
            exec
        });
    }
}
