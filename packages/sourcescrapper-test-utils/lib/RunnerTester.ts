import { IStatic } from './IStatic';
import { Tester } from './Tester';

import { IRunnerArgs, IRunnerOptions, Runner } from 'sourcescrapper-core';

import 'mocha';

export type IArgsTest<RA extends IRunnerArgs> = (args: RA) => Promise<any>;

export class RunnerTester<T, RO extends IRunnerOptions, RA extends IRunnerArgs<RO>, R extends Runner<T, RO, RA>>
    extends Tester<R> {
    public static fromStatic<T, RO extends IRunnerOptions, RA extends IRunnerArgs<RO>, R extends Runner<T, RO, RA>>(
        runner: IStatic<R>
    ): RunnerTester<T, RO, RA, R> {
        return new RunnerTester(new runner());
    }
    public runner: R;
    constructor(runner: R) {
        super();
        this.runner = runner;
    }
    public testArgs(urls: string[], argsTest: IArgsTest<RA>, options?: RO): this {
        return this.runTestForEach(
            urls,
            'should provide valid args',
            async url => this.runner.run(url, argsTest, options));
    }
    protected getTestTarget(): R {
        return this.runner;
    }
}
