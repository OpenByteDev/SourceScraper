import objectMerge = require('object-merge');

export type IOptions = object;

export interface IConfigurable<O extends IOptions = IOptions> {
    defaultOptions: O;
    getOptions: (options?: O) => O;
}

export abstract class Configurable<O extends IOptions = IOptions> implements IConfigurable<O> {
    public abstract defaultOptions: O;

    public getOptions(options?: O): O {
        return typeof options === 'undefined' ?
            this.defaultOptions :
            objectMerge(this.defaultOptions, options) as O;
    }
}
