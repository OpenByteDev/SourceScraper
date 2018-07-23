import objectMerge = require('object-merge');

export type RunnerOptions = object;
export interface RunnerArgs<T> {
    url: string;
    scrapper: RunnerExec<T>;
    options?: any;
}
export type RunnerExec<T> = (RunnerArgs) => Promise<T>;
export abstract class Runner<
        T = any,
        E extends RunnerExec<T> = RunnerExec<T>,
        O extends RunnerOptions = RunnerOptions> {
    public abstract defaultOptions: O;
    public async abstract run(url: string, scrapper: E, options?: O): Promise<T>;
    protected getOptions(options?: O): O {
        return typeof options === 'undefined' ?
            this.defaultOptions :
            objectMerge(this.defaultOptions, options) as O;
    }
}
