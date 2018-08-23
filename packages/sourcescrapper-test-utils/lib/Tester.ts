import { IRunnerArgs } from 'sourcescrapper-core';

import chai = require('chai');
import 'mocha';
chai.should();

export type IArgsTest<RA extends IRunnerArgs> = (args: RA) => Promise<any>;

export interface IHasConstructor {
    constructor: (...args) => any;
}

export abstract class Tester<T> {
    protected abstract getTestTarget(): T;
    protected runTest(title: string, test: () => any): this {
        const name = this.getTestTarget().constructor.name;
        describe(name, () => it(title, test));
        return this;
    }
    protected runTestForEach<E>(ar: E[], title: string, test: (e: E) => any): this {
        return this.runTest(title, () => ar.forEach(test));
    }
}
