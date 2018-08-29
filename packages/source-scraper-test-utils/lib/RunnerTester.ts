import { IStatic } from './IStatic';
import { Tester } from './Tester';

import { IRunnerArgs, IRunnerOptions, Runner } from 'source-scraper-core';

import 'mocha';

export type IArgsTest<RA extends IRunnerArgs> = (args: RA, url: string) => void;

export class RunnerTester<RO extends IRunnerOptions, RA extends IRunnerArgs<RO>, R extends Runner<any, RO, RA>>
    extends Tester<R> {
    public static fromStatic<RO extends IRunnerOptions, RA extends IRunnerArgs<RO>>(
        runner: IStatic<Runner<any, RO, RA>>
    ): RunnerTester<RO, RA, Runner<any, RO, RA>> {
        return new RunnerTester(new runner());
    }
    public runner: R;
    constructor(runner: R) {
        super();
        this.runner = runner;
    }
    public testArgs(urls: string[], argsTest: IArgsTest<RA>, options?: RO): this {
        return this.addTest(
            'should provide valid args',
            () =>
                urls.forEach(async url => this.runner.run(url, async args => {
                    args.should.be.an('object');
                    argsTest(args, url);
                    return Promise.resolve({});
                }, options))
        );
    }
    protected getTestTarget(): R {
        return this.runner;
    }
}
