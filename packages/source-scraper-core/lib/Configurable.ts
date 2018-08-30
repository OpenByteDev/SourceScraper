import objectMerge = require('object-merge');

export type IOptions = object;

export interface IConfigurable<O extends IOptions = IOptions> {
    defaultOptions: O;
    getOptions: (options?: Partial<O>) => O;
    changeOptions: (options: Partial<O>) => O;
}

export abstract class Configurable<O extends IOptions = IOptions> implements IConfigurable<O> {
    public static mergeOptions<O extends IOptions>(
        o1: O,
        o2: Partial<O> | O | undefined): O;
    public static mergeOptions<O extends IOptions>(
        o1: O | Partial<O> | undefined,
        o2: O): O;
    public static mergeOptions<O extends IOptions>(
        o1: Partial<O> | undefined,
        o2: Partial<O>): Partial<O>;
    public static mergeOptions<O extends IOptions>(
        o1: Partial<O>,
        o2: Partial<O> | undefined): Partial<O>;
    public static mergeOptions<O extends IOptions>(
        o1: Partial<O> | undefined,
        o2: Partial<O> | undefined): Partial<O> | undefined;
    public static mergeOptions<O extends IOptions>(
        o1: O | Partial<O> | undefined,
        o2: O | Partial<O> | undefined): O | Partial<O> | undefined {
        const o1u = typeof o1 === 'undefined';
        const o2u = typeof o2 === 'undefined';
        if (o1u) {
            if (o2u)
                return undefined;
            return o2;
        }
        if (o2u)
            return o1;
        return objectMerge(o1 as object, o2 as object);
    }

    public abstract defaultOptions: O;

    public getOptions(options?: Partial<O>): O {
        return typeof options === 'undefined' ?
            this.defaultOptions :
            objectMerge(this.defaultOptions, options) as O;
    }
    public changeOptions(options: Partial<O>): O {
        return (this.defaultOptions = this.getOptions(options));
    }
}
