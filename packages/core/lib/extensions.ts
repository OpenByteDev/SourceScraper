interface RegExp {
    /**
     * @param str The string against which to match the regular expression.
     * @return An array containing the results of the RegExp.prototype.exec method until no match is found.
     */
    execAll: (str: string) => Array<RegExpExecArray | null>;
}
interface Array<T> {
    /**
     * @param callback Function that converts an element to an Array.
     * @param thisArg Value to use as this when executing callback.
     * @return A new array with each element being the flattened result of the callback function.
     */
    flatMap<TResult>(callback: (currentValue: T, index: number, array: T[]) => TResult[], thisArg?: any): TResult[];
}

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

Array.prototype.flatMap = function<T, TResult>(
    callback: (currentValue: T, index: number, array: T[]) => TResult[],
    thisArg?: any): TResult[] {
    return Array.prototype.concat.apply([], this.map(callback, thisArg));
};
