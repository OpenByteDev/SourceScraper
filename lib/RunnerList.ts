import { Runner } from './Runner';

export class RunnerList extends Array<Runner> {
    constructor(length: number)
    constructor(...elements: Runner[])
    constructor(...args: any[]) {
        super(...args);
    }

    public getByType(type: string): Runner | undefined {
        return this.find((e) => e.type === type);
    }
    public toMap(): Map<string, Runner> {
        return new Map(this.map((e) => [ e.type, e ]) as Array<[string, Runner]>);
    }
}
