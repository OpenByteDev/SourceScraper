import chai = require('chai');
import 'mocha';
chai.should();

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
