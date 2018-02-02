const typeOf = require('typeof');


const messages = {
    1: 'unable to extract'
};

class Error {
    constructor(code) {
        this.code = code;
    }
    get message() {
        return typeOf(this.code) !== 'undefined' && this.code in messages ?
            messages[this.code] :
            'unknown error';
    }
}

module.exports = Error;