interface RegExp {
    execAll: (str: string) => any[];
}

interface Array<T> {
    flatMap<TResult>(lambda: (e: T) => TResult[]): TResult[];
}

RegExp.prototype.execAll = function(str: string): any[] {
    const arr: any[] = [];
    let tmp;

    while ((tmp = this.exec(str)) !== null) {
        arr.push(tmp);
        if (!this.global) {
            break;
        }
    }

    return arr;
};

Array.prototype.flatMap = function<T1, T2>(
    lambda: (currentValue: T1, index: number, array: T1[]) => T2[],
    thisArg?: any): T2[] {
    return Array.prototype.concat.apply([], this.map(lambda, thisArg));
};
