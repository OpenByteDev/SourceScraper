if (!RegExp.prototype.execAll)
    RegExp.prototype.execAll = function (str) {
        const arr = [];
        let tmp;

        while ((tmp = this.exec(str)) !== null) {
            arr.push(tmp);
        }

        return arr;
    };

if (!Array.prototype.first)
    RegExp.prototype.first = function () {
        return this.length >= 1 ? this[0] : undefined;
    };

if (!Array.prototype.firstOrDefault)
    RegExp.prototype.firstOrDefault = function (def) {
        return this.length >= 1 ? this[0] : def;
    };

if (!Array.prototype.firstOrNull)
    RegExp.prototype.firstOrNull = function (def) {
        return this.firstOrDefault(null);
    };

if (!Array.prototype.flatMap)
    Array.prototype.flatMap = function(lambda) {
        return Array.prototype.concat.apply([], this.map(lambda));
    };

