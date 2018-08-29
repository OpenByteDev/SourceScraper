import chai = require('chai');
import 'mocha';
chai.should();

export type ITestExec = () => any;
export interface ITest {
    title: string;
    exec: ITestExec;
}

export abstract class Tester<T> {
    public tests: ITest[] = [];
    public run(): void {
        const name = this.getTestTarget().constructor.name;
        describe(name, () => this.tests.forEach(this.runTest));
    }
    public addTest(title: string, exec: ITestExec): this {
        this.tests.push({ title, exec });
        return this;
    }
    protected runTest(test: ITest): this {
        it(test.title, test.exec);
        return this;
    }
    protected abstract getTestTarget(): T;
}
