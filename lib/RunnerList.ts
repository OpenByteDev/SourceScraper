import { Runner } from "./Runner";


export class RunnerList extends Array<Runner> {
    constructor(length: number)
    constructor(...elements: Runner[])
    constructor(...args: any[]) {
        super(...args);
    }

    getByType(type: string): Runner|undefined {
        return this.find(e => e.type === type);
    }
    toMap(): Map<string, Runner> {
        return new Map(this.map(e => [ e.type, e ]) as [string, Runner][]);
    }
}