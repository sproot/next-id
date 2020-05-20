const BaseN = require('./BaseN');
class Base62 extends BaseN {
    static get ALPHABET() {
        return '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
}

module.exports = Base62;
