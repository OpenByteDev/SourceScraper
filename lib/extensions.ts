interface RegExp {
    execAll: (str: string) => any[];
}

interface Array<T> {
    flatMap<TResult>(lambda: (e: T) => TResult[]): TResult[];
}

/**
 * @param str The string against which to match the regular expression.
 * @return An array containing the results of the RegExp.prototype.exec method until no match is found.
 */
RegExp.prototype.execAll = function(str: string): any[] {
    const arr: any[] = [];
    let tmp;

    while ((tmp = this.exec(str)) !== null) {
        arr.push(tmp);
        if (!this.global)
            break;
    }

    return arr;
};

/**
 * @param callback Function that produces an Array, taking three arguments.
 * @param thisArg Value to use as this when executing callback.
 * @return A new array with each element being the flattened result of the callback function.
 */
Array.prototype.flatMap = function<T1, T2>(
    callback: (currentValue: T1, index: number, array: T1[]) => T2[],
    thisArg?: any): T2[] {
    return Array.prototype.concat.apply([], this.map(callback, thisArg));
};
