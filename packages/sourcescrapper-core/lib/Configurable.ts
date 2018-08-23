import objectMerge = require('object-merge');

export type IOptions = object;

export interface IConfigurable<O extends IOptions = IOptions> {
    defaultOptions: O;
    getOptions: (options?: Partial<O>) => O;
    changeOptions: (options: Partial<O>) => O
}

export abstract class Configurable<O extends IOptions = IOptions> implements IConfigurable<O> {
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
